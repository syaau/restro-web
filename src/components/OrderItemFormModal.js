import React, { Component } from 'react';
import { Button, Modal, Table, Icon, Dropdown, Input, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import placeOrder from '../actions/placeOrder';
import updateOrder from '../actions/updateOrder';

class OrderItemFormModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableNo: props.tableNo,
      orderItems: props.orderItems,
      itemId: null,
      quantity: null,
      addOrEditStatus: false,
    };
    console.log('orderitemform constructor', props.tableNo, props.orderItems);

  }

  componentWillReceiveProps(nextProps) {
    console.log('orderitemform receive props', nextProps.tableNo, nextProps.orderItems);

    this.setState({
      tableNo: nextProps.tableNo,
      orderItems: nextProps.orderItems,
      itemId: null,
      quantity: null,
      addOrEditStatus: false,
    });
  }

  tableNumber() {
    return this.props.tables.map((table) => {
      return {
        key: table.id,
        value: table.id,
        text: table.id,
      };
    });
  }

  itemName() {
    return Object.keys(this.props.items).map(k => this.props.items[k]).map(item => ({
      key: item.id,
      value: item.id,
      text: item.name,
    }));
  }

  changeTableNoHandler = (e, data) => {
    this.setState({
      tableNo: data.value,
    });
  }

  changeItemIdHandler = (e, data) => {
    this.setState({
      itemId: data.value,
    });
  }

  inputChangeHandler = (e) => {
    this.setState({
      quantity: e.target.value,
    });
  }

  insertOrderItem = () => {
    if (this.state.quantity > 0 && this.state.itemId) {
      const data = {
        quantity: this.state.quantity,
        itemId: this.state.itemId,
        rate: this.props.items[this.state.itemId].price,
      };

      this.setState({
        orderItems: [...this.state.orderItems, data],
        quantity: 0,
        itemId: null,
      });
    }
  }

  deleteOrderItem = (id) => {
    this.setState({ orderItems: this.state.orderItems.filter(item => item.itemId !== id) });
  }

  render() {
    console.log('Current Item =', this.state.itemId);
    console.log('TOTAL ITEM ADDED IN ARRAY', JSON.stringify(this.state.totalOrderItem));
    console.log('NEW TABLE DATA FOR NUMBER', this.state.tableNo);
    return (
      <div>
        <Modal
          open={this.props.visible}
        >
          <Modal.Header>
            Order Items...
          </Modal.Header>
          <Modal.Content>
            <Table celled inverted selectable>
              <Table.Header>
                <Table.Row textAlign="center">
                  <Table.HeaderCell colSpan="6">
                    <Label pointing="right" size="big">Table No</Label>
                    <Dropdown
                      value={this.state.tableNo}
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
                {this.state.orderItems.map(item => ({
                  ...this.props.items[item.itemId],
                  ...item,
                })).map((item, idx) => (
                  <Table.Row key={`${item.id}-${idx}`}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{item.quantity}</Table.Cell>
                    <Table.Cell>{item.rate}</Table.Cell>
                    <Table.Cell>{item.quantity * item.rate}</Table.Cell>
                    <Table.Cell>
                      <Icon
                        size="big"
                        color="red"
                        name="delete"
                        link
                        onClick={() => this.deleteOrderItem(item.itemId)}
                      />
                    </Table.Cell>
                  </Table.Row>
              ))}
              </Table.Body>
              <Table.Footer>
                <Table.Row textAlign="center">
                  <Table.HeaderCell colSpan="6" >
                    <div className="order-table-footer">
                      <div className="order-table-footer-child">
                        <div>
                          <Label size="big" pointing="right">Item</Label>
                          <Dropdown
                            placeholder="Select Item"
                            value={this.state.itemId}
                            compact
                            selection
                            options={this.itemName()}
                            onChange={this.changeItemIdHandler}
                          />
                        </div>
                        <div>
                          <Label size="big" pointing="right">Quantity</Label>
                          <Input type="text" value={this.state.quantity} onChange={this.inputChangeHandler} />
                        </div>
                        <div className="add-button">
                          <Icon
                            size="huge"
                            color="green"
                            name="add circle"
                            link
                            onClick={this.insertOrderItem}
                          />
                        </div>
                      </div>
                    </div>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </Modal.Content>
          <Modal.Actions>
            <Button labelPosition="left" negative icon="danger" content="Cancel" onClick={this.props.onClose} />
            <Button
              positive
              labelPosition="right"
              icon="checkmark"
              content="Save"
              onClick={() => {
                if (this.props.orderId) {
                  this.props.updateOrder(this.props.orderId, this.state.tableNo, this.state.orderItems);
                } else {
                  this.props.placeOrder(this.state.tableNo, this.state.orderItems);
                }
                this.props.onClose();
              }}
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const res = {
    items: state.items.reduce((r, item) => ({ ...r, [item.id]: item }), {}),
    tables: state.tables,
  };

  if (ownProps.orderId) {
    return {
      ...res,
      tableNo: state.orders.find(o => o.id === ownProps.orderId).tableNo,
      orderItems: state.orderItems.filter(o => o.orderId === ownProps.orderId),
    };
  }

  return {
    ...res,
    tableNo: null,
    orderItems: [],
  };
};

const mapDispatchToProps = dispatch => ({
  updateOrder: (orderId, tableNo, orderItems) => dispatch(updateOrder(orderId, tableNo, orderItems)),
  placeOrder: (tableNo, orderItems) => dispatch(placeOrder(tableNo, orderItems)),
});


OrderItemFormModal.propTypes = {
  items: PropTypes.arrayOf.isRequired,
  tables: PropTypes.arrayOf.isRequired,
  onSuccess: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderItemFormModal);
