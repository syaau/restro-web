import React, { Component } from 'react';
import { Button, Modal, Table, Icon, Dropdown, Input, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import placeOrder from '../actions/placeOrder';
import updateOrder from '../actions/updateOrder';
import AddCustomItem from './AddCustomItem';
import insertItem from './../actions/insertItemData';


class OrderItemFormModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableNo: props.tableNo,
      orderItems: props.orderItems,
      showCustum: false,
      itemId: null,
      quantity: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tableNo: nextProps.tableNo,
      orderItems: nextProps.orderItems,
      itemId: null,
      quantity: null,
    });
  }

  tableNumber() {
    return this.props.tables.map((table) => {
      return {
        value: table.id,
        text: table.id,
      };
    });
  }

  itemName() {
    console.log('items data ',JSON.stringify(this.props.menuItems));
    return Object.keys(this.props.menuItems).map(k => this.props.menuItems[k]).map(item => ({
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
        rate: this.props.menuItems[this.state.itemId].price,
      };

      this.setState({
        orderItems: [...this.state.orderItems, data],
        quantity: 0,
        itemId: null,
      });
    }
  }

  addCustomItem(customdata) {
    const data = {
      quantity: customdata.quantity,
      itemId: customdata.id,
      name: customdata.name,
      rate: customdata.rate,
    }
    this.props.insertItem(data, 'items');
    this.props.insertItem(data, 'menuItems');
    this.setState({
      showCustum: false,
    });
  }
  deleteOrderItem = (id) => {
    this.setState({ orderItems: this.state.orderItems.filter(item => item.itemId !== id) });
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
          <Table celled  selectable >
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
              {console.log('menuItem selected data', JSON.stringify({ ...this.props.menuItems[2], ...{ tableNo: 1, orderNo: 1 } }))}
              {this.state.orderItems.map(item => ({
                ...this.props.menuItems[item.itemId],
                ...item,
              })).map((item, idx) => (
                <Table.Row key={`${item.id}-${idx}`}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell>{item.price}</Table.Cell>
                  <Table.Cell>{item.quantity * item.price}</Table.Cell>
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
            <Table.Row textAlign="center">
              <Table.Cell colSpan="6" >
                <div className="order-table-footer">
                  <div className="order-table-footer-child">
                    <div className="order-table-footer-child">
                      <Label size="big" pointing="right">Item</Label>
                      <Dropdown
                        placeholder="Select Item"
                        value={this.state.itemId}
                        selection
                        search
                        options={this.itemName()}
                        onChange={this.changeItemIdHandler}
                      />
                    </div>
                    <div className="order-table-footer-child">
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
                      <Button
                        positive
                        labelPosition="right"
                        icon="add circle"
                        content="Custom"
                        onClick={() => this.setState({ showCustum: !this.state.showCustum })}
                      />
                    </div>
                  </div>
                </div>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell colSpan="6">
              {this.state.showCustum ? <AddCustomItem onSuccess={data => this.addCustomItem(data)}/> : null}
              </Table.Cell>
            </Table.Row>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button
            positive
            labelPosition="right"
            icon="checkmark"
            content="Save"
            onClick={() => {
              if (this.props.orderId) {
                // this.context.api.updateOrder();
                this.props.updateOrder(this.props.orderId, this.state.tableNo, this.state.orderItems);
              } else {
                this.props.placeOrder(this.state.tableNo, this.state.orderItems);
              }
              this.props.onClose();
            }}
          />
          <Button negative content="Cancel" onClick={this.props.onClose} />
        </Modal.Actions>
      </Modal>
    );
  }
}

OrderItemFormModal.contextTypes = {
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
  updateOrder: (orderId, tableNo, orderItems) => dispatch(updateOrder(orderId, tableNo, orderItems)),
  placeOrder: (tableNo, orderItems) => dispatch(placeOrder(tableNo, orderItems)),
  insertItem: (data, tableName) => dispatch(insertItem(data, tableName)),
});

OrderItemFormModal.propTypes = {
  menuItems: PropTypes.oneOfType([PropTypes.arrayOf, PropTypes.object]).isRequired,
  tables: PropTypes.oneOfType([PropTypes.arrayOf, PropTypes.object]).isRequired,
  visible: PropTypes.bool.isRequired,
  insertItem: PropTypes.func.isRequired,
  updateOrder: PropTypes.func.isRequired,
  placeOrder: PropTypes.func.isRequired,
  orderId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderItemFormModal);
