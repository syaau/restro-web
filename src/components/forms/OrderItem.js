import React, { Component } from 'react';
import { Button, Modal, Table, Icon, Dropdown, Input, Label, Checkbox, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import placeOrder from '../../actions/placeOrder';
import updateOrder from '../../actions/updateOrder';
import AddCustomItem from './../AddCustomItem';
import insertItem from './../../actions/insertItemData';

class OrderItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableId: props.tableId,
      orderItems: props.orderItems,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tableId: nextProps.tableId,
      orderItems: nextProps.orderItems,
    });
  }

  tableNumber() {
    return this.props.tables.map((table) => {
      return {
        value: table.id,
        text: table.name,
      };
    });
  }

  changeTableNoHandler = (e, data) => {
    this.setState({
      tableId: data.value,
    });
  }

  insertOrderItem = (menuItem) => {
    this.setState(prevState => ({
      orderItems: prevState.orderItems.concat(menuItem),
    }));
  }

  deleteOrderItem = (id) => {
    this.setState({ orderItems: this.state.orderItems.filter(item => item.menuItemId !== id) });
  }

  render() {
    return (
      <Modal
        open={this.props.visible}
        dimmer={false}
      >
        <Modal.Header>
          Order Items...
        </Modal.Header>
        <Modal.Content>
          <Table celled selectable compact >
            <Table.Header>
              <Table.Row textAlign="center">
                <Table.HeaderCell colSpan="6">
                  <Label pointing="right" size="big">Table No</Label>
                  <Dropdown
                    value={this.state.tableId}
                    placeholder="0"
                    compact
                    selection
                    options={this.tableNumber()}
                    onChange={this.changeTableNoHandler}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Qty.</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.orderItems.map(orderItem => ({
                ...this.props.menuItems[orderItem.menuItemId],
                ...orderItem,
              })).map((item, idx) => (
                <Table.Row key={`${item.menuItemId}-${idx}`}>
                  <Table.Cell>{item.name || item.menuItemId}</Table.Cell>
                  <Table.Cell>{item.qty}</Table.Cell>
                  <Table.Cell>{item.rate}</Table.Cell>
                  <Table.Cell>{item.qty * item.rate}</Table.Cell>
                  <Table.Cell>
                    <Icon
                      size="big"
                      color="red"
                      name="delete"
                      link
                      onClick={() => this.deleteOrderItem(item.menuItemId)}
                    />
                  </Table.Cell>
                </Table.Row>
          ))}
            </Table.Body>
            <Table.Row>
              <Table.Cell colSpan="6" >
                <Grid>
                  <AddCustomItem menuItems={this.props.menuItems} onSuccess={data => this.insertOrderItem(data)} />
                </Grid>
              </Table.Cell>
            </Table.Row>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            labelPosition="right"
            icon="checkmark"
            disabled={!(this.state.tableId && this.state.orderItems.length > 0)}
            content="Save"
            onClick={() => {
              if (this.state.tableId && this.state.orderItems.length > 0) {
                if (this.props.orderId) {
                  // this.context.api.updateOrder();
                  this.props.api.updateOrder(this.props.orderId, this.state.tableId, this.state.orderItems);
                } else {
                  this.props.api.placeOrder(this.state.tableId, this.state.orderItems);
                }
                this.props.onClose();
              }
            }}
          />
          <Button negative content="Cancel" onClick={this.props.onClose} />
        </Modal.Actions>
      </Modal>
    );
  }
}

OrderItem.contextTypes = {
 // api: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const res = {
    menuItems: state.schema.MenuItem.reduce((r, item) => ({ ...r, [item.id]: item }), {}),
    tables: state.schema.Table,
  };

  if (ownProps.orderId) {
    return {
      ...res,
      tableNo: state.schema.Order.find(o => o.id === ownProps.orderId).tableNo,
      orderItems: state.schema.OrderItem.filter(o => o.orderId === ownProps.orderId),
    };
  }

  return {
    ...res,
    tableNo: null,
    orderItems: [],
  };
};

const mapDispatchToProps = dispatch => ({
  //updateOrder: (orderId, tableNo, orderItems) => dispatch(updateOrder(orderId, tableNo, orderItems)),
 // placeOrder: (tableNo, orderItems) => dispatch(placeOrder(tableNo, orderItems)),
  insertItem: (data, tableName) => dispatch(insertItem(data, tableName)),
});

OrderItem.propTypes = {
  menuItems: PropTypes.oneOfType([PropTypes.arrayOf, PropTypes.object]).isRequired,
  tables: PropTypes.oneOfType([PropTypes.arrayOf, PropTypes.object]).isRequired,
  visible: PropTypes.bool.isRequired,
  insertItem: PropTypes.func.isRequired,
  updateOrder: PropTypes.func.isRequired,
  placeOrder: PropTypes.func.isRequired,
  orderId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderItem);
