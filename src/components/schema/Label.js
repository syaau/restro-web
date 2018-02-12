import React from 'react';
import { PropTypes } from 'prop-types';

const Label = (props, context) => {
  const Component = props.as;
  const { schema, name, field } = props;

  const value = context.getSchemaValue(name);

  let content = value;
  if (schema) {
    const state = context.store.getState();
    const records = state.schema[schema];
    const v = records.find(r => r.id === value);
    console.log('Record value is', v, records);
    if (v) {
      content = typeof field === 'function' ? field(v) : v[field];
    }
  }

  return (
    <Component>{content}</Component>
  );
};

Label.propTypes = {
  as: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
  name: PropTypes.string.isRequired,
  schema: PropTypes.string,
  field: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),
};

Label.defaultProps = {
  as: 'p',
  schema: null,
  field: 'name',
};

Label.contextTypes = {
  getSchemaValue: PropTypes.func.isRequired,
  store: PropTypes.shape({
    getState: PropTypes.func,
  }).isRequired,
};

export default Label;
