import React,{Component} from 'react';
import { MenuItem, Table, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import deleteItem from './../actions/deleteItem';
import PropsTypes from 'prop-types';
import Confirmation from './forms/Confirmation';

class  MenuItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteItemId: null,
    };
  }

  render() {
    console.log('menu items id', this.state);
    return (
      <div>
        <Table celled selectable>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan="8"><h2>Menu Items</h2></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Item Name</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Edit</Table.HeaderCell>
              <Table.HeaderCell>Delete</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {/* {console.log('items name'), props.items.find(item => item.id === 1)} */}
            {this.props.menuItems.map(menuitem => (
              <Table.Row
                key={menuitem.id}
              >
                <Table.Cell>{menuitem.name}</Table.Cell>
                <Table.Cell>{this.props.items.find(item => item.id === menuitem.itemId).name}</Table.Cell>
                <Table.Cell>{menuitem.qty}</Table.Cell>
                <Table.Cell> {menuitem.price}</Table.Cell>
                <Table.Cell>
                  <Icon
                    size="large"
                    color="green"
                    name="edit"
                    link
                    onClick={() => this.toggleItemFormModal(menuitem.id)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Icon
                    size="large"
                    color="red"
                    name="delete"
                    link
                    onClick={() => this.setState({ deleteItemId: menuitem.id })}
                  />
                </Table.Cell>
              </Table.Row>
      ))
      }
          </Table.Body>
        </Table>
        <Confirmation
          visible={!!this.state.deleteItemId}
          message="Do you want do delete "
          header="Delete Item.."
          onClose={(remove) => {
            if (remove) this.props.deleteItem(this.state.deleteItemId, 'menuItems');
            this.setState({ deleteItemId: null });
        }}
        />
      </div>);
  }
}

MenuItems.propTypes = {
  menuItems: PropsTypes.arrayOf.isRequired,
  items: PropsTypes.arrayOf.isRequired,
  deleteItem: PropsTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    menuItems: state.menuItems,
    items: state.items,
  };
};

const mapDispatchToProps = dispatch => ({
  deleteItem: (id, tableName) => dispatch(deleteItem(id, tableName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MenuItems);