import React from 'react';
import PropTypes from 'prop-types';

export default function connectApi(UserComponent) {
  const ApiComponent = (props, context) => (
    <UserComponent {...props} api={context.api} />
  );

  ApiComponent.contextTypes = {
    api: PropTypes.object,
  };

  return ApiComponent;
}
