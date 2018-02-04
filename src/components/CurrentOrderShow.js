import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Icon } from 'semantic-ui-react';
import PropsTypes from 'prop-types';
import selectTableData from './../actions/selectTabledata';
import DeleteConfirmation from './DeleteConfirmation';
import billPrint from './../actions/billPrint';
import deleteOrderItem from './../actions/deleteItem';
import OrderItemFormModal from './OrderItemFormModal';
import insertOrderItems from './../actions/insertItemData';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button';


class CurrentOrderShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: '',
      itemquantity: 0,
      itemId: '',
      orderForm: false,
      printOrder: null,
    };
  }

  render() {
    return (
      <div>
        <Table celled selectable>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan="6"><h2>Current Orders</h2></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>TableNo</Table.HeaderCell>
              <Table.HeaderCell>Items</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Edit</Table.HeaderCell>
              <Table.HeaderCell>Bill</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.orders.map(order => (
              <OrderRow
                key={order.id}
                id={order.id}
                onEdit={orderId => this.setState({ orderForm: order.id })}
                onPrint={orderId => this.setState({ printOrder: orderId })}
              />
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan="6">
                <Button
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
        <OrderItemFormModal
          visible={this.state.orderForm}
          orderId={this.state.orderForm === true ? null : this.state.orderForm}
          onClose={() => this.setState({ orderForm: false })}
        />
        <DeleteConfirmation
          visible={this.state.printOrder !== null}
          message={<p>Print Bill {this.state.printOrder}</p>}
          header="Fudo bill"
          onClose={(remove) => {
            this.setState({ printOrder: null });
          }}
        />
      </div>
    );
  }
}

const OrderRow = connect((state, ownProps) => ({
  items: state.items.reduce((res, item) => ({ ...res, [item.id]: item }), {}),
  order: {
    ...state.orders.find(o => o.id === ownProps.id),
    items: state.orderItems.filter(o => o.orderId === ownProps.id),
    amount: state.orderItems.filter(o => o.orderId === ownProps.id).reduce((sum, orderItem) => (
      sum + (orderItem.quantity * orderItem.rate)
    ), 0),
  },
}))(({
  items, order, onEdit, onDelete, onPrint,
}) => (
  <Table.Row className="table-row-style">
    <Table.Cell>
      {order.tableNo}
    </Table.Cell>
    <Table.Cell>
      {
        order.items.map(it => `${items[it.itemId].name} (${it.quantity})`).join(', ')
      }
    </Table.Cell>
    <Table.Cell>
      {order.amount}
    </Table.Cell>
    <Table.Cell>
      {order.status}
    </Table.Cell>
    <Table.Cell>
      <Icon
        size="large"
        color="green"
        name="edit"
        link
        onClick={() => onEdit(order.id)}
      />
    </Table.Cell>
    <Table.Cell>
      <Icon
        size="large"
        color="green"
        name="print"
        link
        onClick={() => onPrint(order.id)}
      />
    </Table.Cell>
  </Table.Row>
));

const mapOrderItemsDBdataToProps = (state) => {
  return {
    orders: state.orders,
  };
};

const mapOrderItemDispatchToProps = (dispatch) => {
  return {
    billPrint: orderId => dispatch(billPrint(orderId)),
    deleteOrderItem: itemId => dispatch(deleteOrderItem(itemId, 'orderItems')),
    insertOrderItem: orderItems => dispatch(insertOrderItems(orderItems, 'orderItems')),
  };
};

CurrentOrderShow.propTypes = {
  currentOrderData: PropsTypes.arrayOf.isRequired,
  billPrint: PropsTypes.func.isRequired,
  deleteOrderItem: PropsTypes.func.isRequired,
  updateItem: PropsTypes.func.isRequired,
};
export default connect(mapOrderItemsDBdataToProps, mapOrderItemDispatchToProps)(CurrentOrderShow);
