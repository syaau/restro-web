import React from 'react';
import PropTypes from 'prop-types';
import SchemaForm from './SchemaForm';
import SchemaModal from './SchemaModal';

const PurchaseItem = ({ item, ...other }) => (
  <SchemaModal model="purchase" title={`Add ${item.name} stock`} defaultValues={{ itemId: item.id }} {...other}>
    <div className="menu-item-form-quantity">
      <SchemaForm.Input type="number" required label="Qty" placeholder="Qty" name="qty" />
      <div className="menu-item-custom-label">
        <SchemaForm.Label textField="unit" model="items" link="itemId" />
      </div>
    </div>
  </SchemaModal>
);

PurchaseItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PurchaseItem;
