import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Icon, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import billPrint from './../actions/billPrint';
import deleteOrderItem from './../actions/deleteItem';
import OrderItem from './forms/OrderItem';
import insertOrderItems from './../actions/insertItemData';

const OrderRow = ({
  menuItems, order, onEdit, onDelete, onPrint,
}) => (
  <Table.Row className="table-row-style">
    <Table.Cell>
      {order.tableNo}
    </Table.Cell>
    <Table.Cell>
      {
      console.log('Menu items in Curret watch', order)
        // order.items.map(it => `${menuItems[it.itemId].name} (${it.qty})`).join(', ')
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
);

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
                order={order}
                onEdit={orderId => this.setState({ orderForm: orderId })}
                onPrint={orderId => this.setState({ printOrder: orderId })}
              /> : null))
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
          onClose={() => this.setState({ orderForm: false })}
        />
        {/* <DeleteConfirmation
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
        /> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  orders: state.schema.Order,
});


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
