import React, { Component } from 'react';
import { Table, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropsTypes from 'prop-types';
import { SchemaModal } from '../components/schema';
import Confirmation from './forms/Confirmation';
import MenuItemForm from './forms/MenuItem';

const style = {
  width: '100%',
};

function getItemName(itemId, items) {
  if (!itemId) {
    return '<No Item Group>';
  }
  const item = items.find(i => i.id === itemId);
  if (!item) {
    return `[Deleted::${itemId}]`;
  }
  return item.name;
}

function sortMenuItem(a, b) {
  // eslint-disable-next-line no-restricted-globals
  if (a.itemId === b.itemId) {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  return a.itemId - b.itemId;
}

class MenuItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteItemId: null,
      updateMenuItem: null,
    };
  }
  render() {
    const menuItems = this.props.menuItems.slice().sort(sortMenuItem);

    return (
      <div style={style}>
        <Table celled>
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
            {menuItems.map(menuitem => (
              <Table.Row
                key={menuitem.id}
              >
                <Table.Cell>{menuitem.name}</Table.Cell>
                <Table.Cell>{getItemName(menuitem.itemId, this.props.items)}</Table.Cell>
                <Table.Cell>{menuitem.qty}</Table.Cell>
                <Table.Cell> {menuitem.price}</Table.Cell>
                <Table.Cell>
                  <Icon
                    size="large"
                    color="blue"
                    name="edit"
                    link
                    onClick={() => this.setState({ updateMenuItem: menuitem.id })}
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
          <Table.Footer>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan="8" />
            </Table.Row>
          </Table.Footer>
        </Table>
        <Confirmation
          visible={!!this.state.deleteItemId}
          message="Do you want to delete ? "
          header="Delete Menu Item.."
          onClose={(remove) => {
            if (remove) this.props.api.deleteMenuItem(this.state.deleteItemId);
            this.setState({ deleteItemId: null });
        }}
        />
        {this.state.updateMenuItem && <SchemaModal
          remoteApi={this.props.api.updateMenuItem}
          title="Update Menu Item"
          id={this.state.updateMenuItem}
          size="mini"
          closeOnSave
          open={this.state.updateMenuItem}
          form={MenuItemForm}
          onClose={() => this.setState({ updateMenuItem: null })}
        /> }
      </div>);
  }
}

MenuItems.propTypes = {
  menuItems: PropsTypes.arrayOf.isRequired,
  items: PropsTypes.arrayOf.isRequired,
  api: PropsTypes.shape({
    deleteMenuItem: PropsTypes.func,
    updateMenuItem: PropsTypes.func,
  }).isRequired,
};

const mapStateToProps = state => ({
  menuItems: state.schema.MenuItem,
  items: state.schema.Item,
});

export default connect(mapStateToProps)(MenuItems);
