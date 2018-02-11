import { Modal, Input, Button} from 'semantic-ui-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label/Label';

class AddMenuItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddItem: false,
      item: null,
      menuItem: null,
      quantity: null,
      price: null,
    };
  }
  itemName() {
    return Object.keys(this.props.items).map(k => this.props.items[k]).map(item => ({
      key: item.id,
      value: item.id,
      text: item.name,
    }));
  }

  changeItemHandler = (e, data) => {
    this.setState({
      item: data.value,
    });
  }

  inputChangeHandler = (field) => {
    return (e) => {
      this.setState({
        [field]: e.target.value,
      });
    };
}
  render() {
    console.log("add item modal called",JSON.stringify(this.state));
    const { menuItem, quantity, price } = this.state;
    return (
      <Modal
        open={this.props.visible}
      >
        <Modal.Header>
        Enter menu item details
        </Modal.Header>
        <div className="item-menu-form">
          <Modal.Content>
            <Label size="big" pointing="right">Item</Label>
            <Dropdown
              placeholder="Select Item"
              onChange={this.changeItemHandler}
              search
              selection
              options={this.itemName()}
            />
            <Input
              type="text"
              label="Name"
              placeholder="Name..."
              value={menuItem}
              onChange={this.inputChangeHandler('menuItem')}
            />
            <Input
              label="Type"
              placeholder="Type..."
              value={quantity}
              onChange={this.inputChangeHandler('quantity')}
            />
            <Input
              type="text"
              label="Threshold"
              placeholder="Threshold..."
              value={price}
              onChange={this.inputChangeHandler('price')}
            />
          </Modal.Content>
        </div>
        <Modal.Actions>
          <Button>Submit</Button>
          <Button onClick={this.props.onClose}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    items: state.items,
  };
};
export default connect(mapStateToProps)(AddMenuItemModal);

