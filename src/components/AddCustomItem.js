import React, { Component } from 'react';
import { Label, Input, Grid, Dropdown, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class AddOrderItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuItemOptions: Object.keys(props.menuItems).map(id => ({
        value: id,
        text: props.menuItems[id].name,
      })),
    };
  }

  changeInputHandler = field => (e, data) => {
    this.setState({
      [field]: data.value,
    });
  }

  changeMenuItem = (e, data) => {
    const menuItem = this.props.menuItems[data.value];
    if (menuItem) {
      this.setState({
        menuItemId: data.value,
        rate: menuItem.price,
      });
    } else {
      this.setState({
        menuItemId: data.value,
        rate: 0,
      });
    }
  }

  handleAddItem = (e, data) => {
    this.setState(prevState => ({
      menuItemOptions: prevState.menuItemOptions.concat({
        value: data.value,
        text: data.value,
      }),
    }));
  }

  handleSubmit = () => {
    const res = {
      menuItemId: this.state.menuItemId,
      qty: this.state.qty,
      rate: this.state.rate,
    };

    if (res.qty && res.menuItemId && res.rate) {
      this.reset();
      this.props.onSuccess(res);
    }
  }

  reset() {
    this.setState({
      menuItemId: '',
      qty: 1,
      rate: '',
    });
  }

  render() {
    return (
      <Grid.Column width={16}>
        <Grid.Row>
          <Label pointing="right" size="mini"> Item </Label>
          <Dropdown
            size="mini"
            options={this.state.menuItemOptions}
            search
            onChange={this.changeMenuItem}
            value={this.state.menuItemId}
            selection
            allowAdditions
            onAddItem={this.handleAddItem}
          />
          <Label pointing="right" size="mini">Qty:</Label>
          <Input size="mini" type="number" value={this.state.qty} onChange={this.changeInputHandler('qty')} />

          <Label pointing="right" size="mini">Rate</Label>
          <Input size="mini" type="number" value={this.state.rate} onChange={this.changeInputHandler('rate')} />

          <Button
            style={{ marginLeft: '10px' }}
            color="blue"
            icon="add circle"
            link
            onClick={this.handleSubmit}
          />
        </Grid.Row>
      </Grid.Column>
    );
  }
}

AddOrderItem.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  menuItems: PropTypes.shape({}).isRequired,
};

export default AddOrderItem;
