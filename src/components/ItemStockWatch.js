import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import selectTabledata from './../actions/selectTabledata';
import deleteItem from './../actions/deleteItem';
import ItemFormModal from './ItemFormModal';
import DeleteConfirmation from './DeleteConfirmation';
import insertItem from './../actions/insertItemData';
import updateItem from './../actions/updateData';

class ItemStockWatchComponent extends Component {
  constructor(props) {
    super(props);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.toggleItemFormModal = this.toggleItemFormModal.bind(this);
    this.state = {
      open: false,
      // itemFormStatus: false,
      editItemId: null,
      addItem: false,
      deleteItemId: null,
    };
  }
  toggleDeleteModal(currentId) {
    this.setState({
      open: !this.state.open,
      deleteItemId: currentId,
    });
  }

  toggleItemFormModal(id) {
    this.setState({
      editItemId: id,
    });
  }

  render() {
    return (
      <div>
        <Table celled inverted selectable>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan="6"><h2>Item Stock Watch</h2></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Type</Table.HeaderCell>
              <Table.HeaderCell>Stock</Table.HeaderCell>
              <Table.HeaderCell>Edit</Table.HeaderCell>
              <Table.HeaderCell>Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.currentStockWatch.map(item => (
              <Table.Row
                key={item.id}
                style={{
                  background: item.quantity > parseInt(item.threshold, 10) ? '' : '#8B1D06',
                  }}
              >
                <Table.Cell >{item.name}</Table.Cell>
                <Table.Cell>{item.price}</Table.Cell>
                <Table.Cell>{item.type}</Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>
                  <Icon
                    size="big"
                    color="green"
                    name="edit"
                    link
                    onClick={() => this.toggleItemFormModal(item.id)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Icon
                    size="big"
                    color="red"
                    name="delete"
                    link
                    onClick={() => this.toggleDeleteModal(item.id)}
                  />
                </Table.Cell>
              </Table.Row>
      ))
      }
          </Table.Body>
          <Table.Footer>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan="6">
                <Icon
                  size="huge"
                  color="green"
                  name="add circle"
                  link
                  onClick={() => this.setState({ addItem: true })}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        <ItemFormModal
          id={this.state.editItemId}
          visible={!!this.state.editItemId}
          onSuccess={data => this.props.updateItem(data, this.state.editItemId)}
          onClose={() => this.setState({ editItemId: null })}
        />
        <ItemFormModal
          visible={this.state.addItem}
          onSuccess={data => this.props.insertItem(data)}
          onClose={() => this.setState({ addItem: false })}
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
  };
};
const mapDispatchToProps = (dispatch) => {
  dispatch(selectTabledata('items'));

  return {
    removeItem: id => dispatch(deleteItem(id, 'items')),
    insertItem: data => dispatch(insertItem(data, 'items')),
    updateItem: (data, itemId) => dispatch(updateItem('items', itemId, data)),
  };
};

ItemStockWatchComponent.propTypes = {
  removeItem: PropTypes.func.isRequired,
  currentStockWatch: PropTypes.arrayOf.isRequired,
  insertItem: PropTypes.func.isRequired,
  updateItem: PropTypes.func.isRequired,

};

export default connect(mapStateToProps, mapDispatchToProps)(ItemStockWatchComponent);
