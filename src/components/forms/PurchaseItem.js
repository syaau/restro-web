import React from 'react';
import PropTypes from 'prop-types';
import { Label } from 'semantic-ui-react';
import { SchemaForm, SchemaLabel } from '../schema';

const PurchaseItem = ({ item, ...props }) => (
  <SchemaForm {...props} schema="Purchase">
    <SchemaForm.Input type="number" required label="Qty" placeholder="Enter quantity here..." name="qty" labelPosition="right">
      <input />
      <SchemaLabel name="itemId" schema="Item" field="unit" as={Label} />
    </SchemaForm.Input>
  </SchemaForm>
);

PurchaseItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PurchaseItem;
