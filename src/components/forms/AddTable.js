import React from 'react';
import PropTypes from 'prop-types';
import { SchemaForm } from '../schema';

const AddTable = props => (
  <SchemaForm {...props} schema="Table">
    <SchemaForm.Input type="text" required label="Table Name" placeholder="Enter table name.." name="name" />
  </SchemaForm>
);

AddTable.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddTable;
