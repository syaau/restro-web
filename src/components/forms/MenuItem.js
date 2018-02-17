import React, { Component } from 'react';
import { Form, Label, Button, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { SchemaForm, SchemaLabel, SchemaModal } from '../schema';
import { Item } from './dropdowns';
import ItemForm from './Item';

class MenuItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addItem: false,
    };
  }

handleItem = (e) => {
  e.preventDefault();
  this.setState({
    addItem: true,
  });
}
render() {
  return (
    <SchemaForm {...this.props} schema="MenuItem">
      <Grid columns={2} verticalAlign="middle">
        <Grid.Row centered>
          <Grid.Column>
            <Form.Dropdown
              required
              label="Item"
              control={Item}
              name="itemId"
              search
              selection
              fluid
              placeholder="Item group"
            />
          </Grid.Column>
          <Grid.Column verticalAlign="bottom">
            {this.props.showAddItem &&  <SchemaModal
              trigger={<Button labelPosition="right" icon="add circle" primary onClick={this.handleItem} content="Item" />}
              size="mini"
              remoteApi={this.props.api.insertItem}
              title="New Item"
              open={this.state.addItem}
              form={ItemForm}
              onClose={() => this.setState({ addItem: false })}
              />}
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <SchemaForm.Input name="name" label="Name" placeholder="Menu Item Name" required />
      <SchemaForm.Input name="qty" label="Item Qty" placeholder="Item Qty" labelPosition="right" required>
        <input />
        <SchemaLabel name="itemId" schema="Item" field="unit" as={Label} />
      </SchemaForm.Input>
      <SchemaForm.Input name="price" label="Price" placeholder="Menu price" required />
    </SchemaForm>
  );
}
}


MenuItem.propTypes = {
  showAddItem: PropTypes.bool.isRequired,
  api: PropTypes.shape({insertItem: PropTypes.func }).isRequired,

};
export default MenuItem;
