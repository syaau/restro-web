import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Icon, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import selectTabledata from './../actions/selectTabledata';
import deleteItem from './../actions/deleteItem';
import ItemFormModal from './ItemFormModal';
import DeleteConfirmation from './DeleteConfirmation';
import insertItem from './../actions/insertItemData';
import updateItem from './../actions/updateData';
import MenuItem from './forms/MenuItem';
import PurchaseItem from './forms/PurchaseItem';

class ItemStockWatchComponent extends Component {
  constructor(props) {
    super(props);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleItemFormModal = this.toggleItemFormModal.bind(this);
    this.state = {
      open: false,
      // itemFormStatus: false,
      purchaseItem: null, // For purchasing items (updating stock)
      editMenuItemId: null,
      menuItem: false,
      item: null,
      deleteItemId: null,
      showAddStock: false,
    };
  }

  toggleDeleteModal(currentId) {
    this.setState({
      open: !this.state.open,
      deleteItemId: currentId,
    });
  }

  QuantiyCalculator = (itemId) => {
    let totalItemQuantiy = this.props.purchase.reduce((res, next) => (next.itemId === itemId ? res + parseInt(next.qty, 10) : res), 0);
    console.log(JSON.stringify(totalItemQuantiy));
    const billedOrder = this.props.orders.filter(order => order.status === 'billed');
    const finalArray = billedOrder.map(order => this.props.orderItems.filter(orderitem => orderitem.orderId === order.id));
    finalArray.forEach(arr => arr.forEach(obj => (obj.itemId === itemId ? totalItemQuantiy -= parseInt(obj.quantity, 10) : null)));
    return totalItemQuantiy;
  }

  toggleItemFormModal(id) {
    this.setState({
      editItemId: id,
    });
  }

  render() {
    return (
      <div>
        <Table celled selectable>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan="8"><h2>Item Stock Watch</h2></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Unit</Table.HeaderCell>
              <Table.HeaderCell>Threshold</Table.HeaderCell>
              <Table.HeaderCell>Edit</Table.HeaderCell>
              <Table.HeaderCell>Delete</Table.HeaderCell>
              <Table.HeaderCell>Stock</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.currentStockWatch.map(item => (
              <Table.Row
                key={item.id}
                style={{
                  background: this.QuantiyCalculator(item.id) > parseInt(item.threshold, 10) ? '' : '#CD6155',
                  }}
              >
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{this.QuantiyCalculator(item.id)}</Table.Cell>
                <Table.Cell>{item.unit}</Table.Cell>
                <Table.Cell>{item.threshold}</Table.Cell>
                <Table.Cell>
                  <Icon
                    size="large"
                    color="green"
                    name="edit"
                    link
                    onClick={() => this.toggleItemFormModal(item.id)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Icon
                    size="large"
                    color="green"
                    name="delete"
                    link
                    onClick={() => this.toggleDeleteModal(item.id)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Icon
                    size="large"
                    color="green"
                    name="add circle"
                    link
                    onClick={() => this.setState({ purchaseItem: item })}
                  />
                </Table.Cell>
              </Table.Row>
      ))
      }
          </Table.Body>
          <Table.Footer>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan="8">
                <Button
                  color="green"
                  labelPosition="right"
                  icon="add circle"
                  content="Add Menu Item"
                  onClick={() => this.setState({ menuItem: true })}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        <MenuItem
          open={this.state.menuItem}
          onClose={() => this.setState({ menuItem: false })}
        />
        { this.state.purchaseItem && <PurchaseItem
          open
          item={this.state.purchaseItem}
          onClose={() => this.setState({ purchaseItem: null })}
        /> }
        <ItemFormModal
        //   id={this.state.editItemId}
        //   //visible={!!this.state.editItemId}
        //   onSuccess={data => this.props.updateItem(data, this.state.editItemId)}
        //  // onClose={() => this.setState({ editItemId: null })}
        />
        <ItemFormModal
        //  // visible={this.state.addItem}
        //   onSuccess={data => this.props.insertItem(data)}
        // //  onClose={() => this.setState({ addItem: false })}
        />
        <DeleteConfirmation
          visible={!!this.state.deleteItemId}
          message="Do you want do delete "
          header="Delete Item.."
          onClose={(remove) => {
            if (remove) this.props.removeItem(this.state.deleteItemId);
            this.setState({ deleteItemId: null });
          }}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currentStockWatch: state.items,
    orders: state.orders,
    orderItems: state.orderItems,
    purchase: state.purchase,
  };
};
const mapDispatchToProps = (dispatch) => {

  return {
    removeItem: id => dispatch(deleteItem(id, 'items')),
    insertItem: data => dispatch(insertItem(data, 'items')),
    updateItem: (data, itemId) => dispatch(updateItem('items', itemId, data)),
  };
};

ItemStockWatchComponent.propTypes = {
  removeItem: PropTypes.func.isRequired,
  currentStockWatch: PropTypes.oneOfType([PropTypes.arrayOf, PropTypes.object]).isRequired,
  insertItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,
  orders: PropTypes.arrayOf.isRequired,
  purchase: PropTypes.arrayOf.isRequired,
  orderItems: PropTypes.arrayOf.isRequired,

};

export default connect(mapStateToProps, mapDispatchToProps)(ItemStockWatchComponent);
