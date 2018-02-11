import React from 'react';
import SchemaForm from './SchemaForm';
import SchemaModal from './SchemaModal';

const AddItem = (props) =>  {
  const { ...other } = props;
  return (
    <SchemaModal model="items" title="Enter Items Details" {...other}>
      <div className="drop-down-menu">
        <SchemaForm.DropDown
          required
          label="Select Type"
          options={
            [
              { key: 1, value: 'kitchen', text: 'Kitchen' },
              { key: 2, value: 'bar', text: 'Bar' },
              { key: 3, value: 'coffee', text: 'Coffee' }
            ]
          }
          optionsplaceholder="Type"
          name="itemType"
          search
          selection
        />
      </div>
      <div className="form-input-field">
        <SchemaForm.Input labelPosition="left" required label="Item Name" placeholder="Item name" name="name" />
        <div className="drop-down-menu">
          <SchemaForm.Input required label="Unit" placeholder="unit..." name="unit" />
        </div>
        <div className="menu-item-form-quantity">
          <SchemaForm.Input type="number" required label="Threshold" placeholder="Threshold" name="threshold" />
          <div className="menu-item-custom-label">
            <SchemaForm.Label link="unit" textField="name" size="mini" />
          </div>
        </div>
      </div>
    </SchemaModal>
  );
}
export default AddItem;
