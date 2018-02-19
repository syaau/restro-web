import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import OrderItem from '../forms/OrderItem';
import OrderRow from './OrderRow';
import DeleteConfirmation from '../forms/Confirmation';

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderForm: null,
      printOrder: null,
      cancelOrder: null,
    };
  }

  render() {
    return (
      <div>
        <Table celled selectable>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan="7"><h2>Current Orders</h2></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Table</Table.HeaderCell>
              <Table.HeaderCell>Items</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell colSpan={3} />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.orders.map(order => (
              <OrderRow
                key={order.id}
                order={order}
                onEdit={order => this.setState({ orderForm: order.id })}
                onPrint={order => this.setState({ printOrder: order })}
                onDelete={order => this.setState({ cancelOrder: order })}
              />))
            }
          </Table.Body>
          <Table.Footer>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan="6">
                <Button
                  primary
                  color="green"
                  labelPosition="right"
                  icon="add circle"
                  content="Add Order"
                  onClick={() => this.setState({ orderForm: true })}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        <OrderItem
          api={this.props.api}
          visible={this.state.orderForm}
          orderId={this.state.orderForm === true ? null : this.state.orderForm}
          onClose={() => this.setState({ orderForm: null })}
        />
        {<DeleteConfirmation
          visible={this.state.cancelOrder !== null}
          message={this.state.cancelOrder && <p>Are you sure you want to cancel order for table {this.state.cancelOrder.tableNo}?</p>}
          header="Cancel Order"
          onClose={(confirm) => {
            if (confirm) {
              this.props.api.cancelOrder(this.state.cancelOrder.id);
            }
            this.setState(({ cancelOrder: null }));
          }}
        />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  orders: state.schema.Order,
});

Orders.propTypes = {
  api: PropTypes.shape({
    cancelOrder: PropTypes.func,
    completeOrder: PropTypes.func,
  }).isRequired,
  orders: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    tableId: PropTypes.number,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.name,
    })),
  })).isRequired,
};

export default connect(mapStateToProps)(Orders);
