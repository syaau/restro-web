import React from 'react';
import { Form, Label } from 'semantic-ui-react';
import { SchemaForm, SchemaLabel } from '../schema';
import { Item } from './dropdowns';

const MenuItem = props => (
  <SchemaForm {...props} schema="MenuItem">
    <Form.Field
      label="Item"
      control={Item}
      name="itemId"
      search
      fluid
      placeholder="Item group"
    />
    <SchemaForm.Input name="name" label="Name" placeholder="Menu Item Name" />
    <SchemaForm.Input name="qty" label="Item Qty" placeholder="Item Qty" labelPosition="right">
      <input />
      <SchemaLabel name="itemId" schema="Item" field="unit" as={Label} />
    </SchemaForm.Input>
    <SchemaForm.Input name="price" label="Price" placeholder="Menu price" />
  </SchemaForm>
);

export default MenuItem;
