import React, { Component } from 'react';
import { Segment, Button, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { SchemaModal, SchemaGrid } from '../components/schema';
import MenuItemForm from '../components/forms/MenuItem';
import Confirmation from './forms/Confirmation';
import PurchaseItem from './forms/PurchaseItem';
import ReconciliationStock from './forms/ReconciliationStock';


class StockWatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addMenuItem: false,
      showconfirmation: null,
      showPurchase: false,
      itemRecord: null,
      showReconciliationStock: false,
    };
  }

  reconcilationSuccessHandler = (data) => {
    this.props.api.reconcile(data);
    this.setState({
      showReconciliationStock: false,
    });
  }
  handleOpen = () => this.setState({ addMenuItem: true });

  deleteItemHandler = itemId => this.setState({ showconfirmation: itemId });

  render() {
    const { addMenuItem, showPurchase } = this.state;
    const { api } = this.props;
    const actionButtons = [];
    if (this.props.allowPurchase) {
      actionButtons.push({
        icon: 'add circle', color: 'blue', hoverMessage: 'Add Stock', action: record => this.setState({ showPurchase: !this.state.showPurchase, itemRecord: record })
      });
    }
    if (this.props.allowItemRemove) {
      actionButtons.push({
        icon: 'delete', color: 'red', hoverMessage: 'Delete Item', action: record => this.deleteItemHandler(record.id),
      });
    }
    return (
      <SchemaGrid
        schema="Item"
        fields={[
          { name: 'name', header: 'Name' },
          { name: 'stock', header: 'Stock' },
          { name: 'threshold', header: 'Threshold' },
        ]}
        title="Stock Watch"
        emptyMessage="No items in database"
        actionButtons={actionButtons}
        renderFooter={() => (
          <Segment textAlign="center">
            <Grid centered>
              <Grid.Row>
                <SchemaModal
                  trigger={<Button labelPosition="right" icon="add circle" primary onClick={this.handleOpen} content="Memu Item" />}
                  remoteApi={api.insertMenuItem}
                  title="New Menu Item"
                  api={api}
                  size="mini"
                  open={addMenuItem}
                  form={MenuItemForm}
                  onClose={() => this.setState({ addMenuItem: false })}
                />
                { this.props.allowReconcile && <Button
                  labelPosition="right"
                  icon="edit"
                  primary
                  onClick={() => this.setState({ showReconciliationStock: !this.showReconciliationStock })}
                  content="Reconcile"
                /> }
              </Grid.Row>
            </Grid>
            {this.state.showconfirmation !== null ?
              <Confirmation
                visible={this.state.printOrder !== null}
                message={<p>Do you want to delete ? </p>}
                header="Delete"
                onClose={(remove) => {
                if (remove) {
                this.props.api.deleteItem(this.state.showconfirmation);
                this.setState(({ showconfirmation: null }));
                } else {
                this.setState({ showconfirmation: null });
              }
              }}
              /> : null
          }
            {this.state.showReconciliationStock ?
              <ReconciliationStock
                open={this.state.showReconciliationStock}
                onSuccess={data => this.reconcilationSuccessHandler(data)}
                onClose={() => this.setState({ showReconciliationStock: false })}
              /> : null}
            {this.state.itemRecord &&
            <SchemaModal
              remoteApi={api.purchaseItem}
              title={ `Add ${this.state.itemRecord.name}  Stock`}
              size="mini"
              initialData={{ itemId: this.state.itemRecord.id }}
              open={showPurchase}
              form={PurchaseItem}
              onClose={() => this.setState({ showPurchase: false })}
            />}
          </Segment>
        )}
      />
    );
  }
}

StockWatch.propTypes = {
  allowReconcile: PropTypes.bool,
  allowItemRemove: PropTypes.bool,
  allowPurchase: PropTypes.bool,
  api: PropTypes.shape({
    deleteItem: PropTypes.func,
    reconcile: PropTypes.func,
  }).isRequired,
};

StockWatch.defaultProps = {
  allowItemRemove: false,
  allowPurchase: false,
  allowReconcile: false,
}


export default StockWatch;
