import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dimmer, DimmerDimmable, Form, Loader } from 'semantic-ui-react';
import Dropdown from './Dropdown';

import connectInput from './connectInput';
import withOptions from './withOptions';
import getRecord from '../../reducers/getRecord';

class SchemaForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.initialData,
      loading: false,
    };
  }

  getChildContext() {
    const { data } = this.state;
    return {
      getSchemaValue: name => (data[name] === undefined ? '' : data[name]),
      updateSchemaValue: (name, value) => this.setState(prevState => ({
        data: {
          ...prevState.data,
          [name]: value === '' ? undefined : value,
        },
      })),
    };
  }

  componentWillReceiveProps(nextProps) {
    // Override the data with the incoming initialData
    if (nextProps.initialData !== this.props.initialData) {
      this.setState({
        data: {
          ...this.state.data,
          ...nextProps.initialData,
        },
      });
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    const { schema, id, data } = this.state;
    const { onSuccess, remoteApi } = this.props;

    this.setState({ loading: true });
    const res = await remoteApi(data, id, schema);
    this.setState({ loading: false });
    if (onSuccess) {
      onSuccess(res);
    }
  }

  render() {
    const {
      id, initialData, schema, children, onSuccess, remoteApi, __submit__, ...other
    } = this.props;
    const { loading } = this.state;

    return (
      <DimmerDimmable dimmed={!!loading}>
        <Dimmer active={!!loading}>
          <Loader>Saving...</Loader>
        </Dimmer>
        <div ref={(node) => { this.form = node; }}>
          <Form {...other} onSubmit={this.handleSubmit}>
            { children }
            { __submit__ }
          </Form>
        </div>
      </DimmerDimmable>
    );
  }
}

SchemaForm.propTypes = {
  initialData: PropTypes.shape({}),
  id: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  schema: PropTypes.string.isRequired,
  remoteApi: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  __submit__: PropTypes.element,
};

SchemaForm.defaultProps = {
  id: null,
  initialData: {},
  onSuccess: null,
  __submit__: null,
};

SchemaForm.childContextTypes = {
  getSchemaValue: PropTypes.func.isRequired,
  updateSchemaValue: PropTypes.func.isRequired,
};

SchemaForm.Input = connectInput(Form.Input);
SchemaForm.Dropdown = connectInput(Dropdown);

SchemaForm.connectInput = connectInput;
SchemaForm.withOptions = withOptions;

const mapStateToProps = (state, ownProps) => ({
  initialData: ownProps.id ? getRecord(state, ownProps) : ownProps.initialData,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SchemaForm);
