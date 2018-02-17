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

class MenuItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteItemId: null,
      updateMenuItem: null,
    };
  }
  render() {
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

const mapStateToProps = (state) => {
  return {
    menuItems: state.schema.MenuItem,
    items: state.schema.Item,
  };
};

export default connect(mapStateToProps)(MenuItems);