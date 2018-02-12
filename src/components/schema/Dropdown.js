import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';

/**
 * A fix for semantic UI's controlled component problem
 * when the value is provided is not in the options list
 */

class DropdownFix extends Component {
  constructor(props) {
    super(props);

    const v = props.options.find(o => o.value === props.value);
    this.state = {
      value: v ? v.value : undefined,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value || this.props.options !== nextProps.options) {
      const v = nextProps.options.find(o => o.value === nextProps.value);
      this.setState({
        value: v ? v.value : undefined,
      });
    }
  }

  render() {
    const { value } = this.state;
    return (
      <Form.Dropdown {...this.props} value={value} />
    );
  }
}

DropdownFix.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    text: PropTypes.string,
  })),
  // eslint-disable-next-line react/forbid-prop-types
  value: PropTypes.any.isRequired,
};

DropdownFix.defaultProps = {
  options: [],
};

export default DropdownFix;
