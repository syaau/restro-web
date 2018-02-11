import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import SchemaForm from './SchemaForm';
import AddItem from './AddItem';
import SchemaModal from './SchemaModal';

class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addedItemId: 2,
      showAddItem: false,
    };
  }

  render() {
    const { ...other } = this.props;
    const { addedItemId } = this.state;
    console.log('added item in Menu form', addedItemId);

    return (
      <SchemaModal model="menuItems" title="Enter Menu Item Details" {...other}>
        <div className="drop-down-menu">
          <SchemaForm.ModelDropDown labelPosition="left" label="Select item name" model="items" placeholder="Item" name="itemId" search selection />
          <div className="menu-item-button">
            <Button
              size=" mini"
              color="green"
              labelPosition="right"
              icon="add circle"
              content="Add Item"
              onClick={(e) => { e.preventDefault(); this.setState({ showAddItem: true }); }}
            />
          </div>
        </div>
        <div className="form-input-field">
          <SchemaForm.Input labelPosition="left" required label="Menu Item" placeholder="Menu name" name="name" />
          <div className="menu-item-form-quantity">
            <SchemaForm.Input type="number" required label="Qty" placeholder="Qty" name="qty" />
            <div className="menu-item-custom-label">
              <SchemaForm.Label link="itemId" textField="unit" model="items" size="mini" />
            </div>
          </div>
          <SchemaForm.Input type="number" required label="Price" placeholder="Price" name="price" />
        </div>
        <AddItem
          open={this.state.showAddItem}
          onSuccess={data => this.setState({ addedItemId: data.id, showAddItem: false })}
          onClose={() => this.setState({ showAddItem: false })}
        />
      </SchemaModal>
    );
  }
}

MenuItem.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MenuItem;
