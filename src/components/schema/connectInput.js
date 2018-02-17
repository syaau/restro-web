import React from 'react';
import PropTypes from 'prop-types';

export default function connectInput(InputComponent) {
  const ConnectedInput = (props, context) => {
    const v = context.getSchemaValue(props.name);
    return (
      <InputComponent
        {...props}
        value={v}
        onChange={(e, { name, value }) => context.updateSchemaValue(name, value)}
      />
    );
  };

  ConnectedInput.propTypes = {
    name: PropTypes.string.isRequired,
  };

  ConnectedInput.contextTypes = {
    getSchemaValue: PropTypes.func.isRequired,
    updateSchemaValue: PropTypes.func.isRequired,
  };

  return ConnectedInput;
}