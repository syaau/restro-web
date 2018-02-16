import React from 'react';
import { SchemaForm } from '../schema';

const AddUser = props => (
  <SchemaForm {...props} schema="User">
    <SchemaForm.Dropdown
      required
      label="Select Type"
      options={
        [
          { value: 'Waiter', text: 'Waiter' },
          { value: 'Cashier', text: 'Cashier' },
          { value: 'Admin', text: 'Admin' },
        ]
      }
      optionsplaceholder="Type"
      name="role"
      search
      selection
    />
    <SchemaForm.Input name="name" label="Name" placeholder="Name..." required />
    <SchemaForm.Input name="username" label="Username" placeholder="Username, ..." required />
    <SchemaForm.Input name="password" label="Password" placeholder="Password, ..." required />
  </SchemaForm>
);
export default AddUser;
