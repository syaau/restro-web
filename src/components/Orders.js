import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Icon, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import DeleteConfirmation from './DeleteConfirmation';
import billPrint from './../actions/billPrint';
import deleteOrderItem from './../actions/deleteItem';
import OrderItemFormModal from './OrderItemFormModal';
import insertOrderItems from './../actions/insertItemData';

const OrderRow = connect((state, ownProps) => ({
  menuItems: state.items.reduce((res, item) => ({ ...res, [item.id]: item }), {}),
  order: {
    ...state.orders.find(o => o.id === ownProps.id),
    items: state.schema.OrderItem.filter(o => o.orderId === ownProps.id),
    amount: state.OrderItems.filter(o => o.orderId === ownProps.id).reduce((sum, orderItem) => (
      sum + (orderItem.quantity * orderItem.rate)
    ), 0),
  },
}))(({
  menuItems, order, onEdit, onDelete, onPrint,
}) => (
  <Table.Row className="table-row-style">
    <Table.Cell>
      {order.tableNo}
    </Table.Cell>
    <Table.Cell>
      {
      //  console.log('Menu items in Curret watch',menuItems[1].name)
        order.items.map(it => `${menuItems[it.itemId].name} (${it.quantity})`).join(', ')
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

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
            {this.props.orders.map(order => (order.status !== 'billed' ?
              <OrderRow
                key={order.id}
                id={order.id}
                onEdit={orderId => this.setState({ orderForm: orderId })}
                onPrint={orderId => this.setState({ printOrder: orderId })}
              /> : null))
            }
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
            if (remove) {
            this.props.billPrint(this.state.printOrder);
             this.setState(({ printOrder: null }));
            } else {
            this.setState({ printOrder: null });
          }
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  orders: state.schema.Order,
});

// const mapDispatchToProps = (dispatch) => {
//   return {
//     billPrint: orderId => dispatch(billPrint(orderId)),
//     deleteOrderItem: itemId => dispatch(deleteOrderItem(itemId, 'orderItems')),
//     insertOrderItem: orderItems => dispatch(insertOrderItems(orderItems, 'orderItems')),
//   };
// };

Orders.propTypes = {
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
