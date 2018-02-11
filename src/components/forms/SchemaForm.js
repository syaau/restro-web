import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Label, Message } from 'semantic-ui-react';
import { connect as reduxConnect } from 'react-redux';
import PropTypes from 'prop-types';
import insertItem from './../../actions/insertItemData';
import updateItem from '../../actions/updateData';

class SchemaForm extends Component {
  constructor(props) {
    super(props);
    const { initialData } = this.props;
    console.log('initidal data at schema form ', JSON.stringify(initialData));
    this.state = {
      data: initialData,
      showPopup: false,
    };
    this.required = [];
  }

  getChildContext() {
    return {
      getSchemaValue: name => this.state.data[name],
      updateSchemaValue: (name, value) => this.setState(prevState => ({
        data: {
          ...prevState.data,
          [name]: value,
        },
      })),
      triggerSubmit: this.onSubmit,
      // setRequiredField: name => this.required.push(name),
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('Next props', nextProps);
    const { initialData } = nextProps;
    console.log(initialData, this.state.data);
    // this.setState({
    //   data: { ...this.state.data, ...initialData },
    // });
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onSubmit = async () => {
    const { data } = this.state;
    this.required.forEach((requiredField) => {
      if (!data[requiredField]) {
        throw new Error(`${requiredField} is required`);
      }
    });

    const { id, model, insertItem, updateItem, onSuccess } = this.props;

    let res = data;
    try {
      if (id) {
        // this is an update
        await updateItem(model, id, data);
      } else {
        // this is an insert
        res = await insertItem(data, model);
      }
      this.handleSubmitPopup();
      onSuccess(res);
    } catch (e) {
      console.error(e);
      // TODO: How to handle the error ?
    }
  }

  submit() {
    // eslint-disable-next-line react/no-find-dom-node
    const form = ReactDOM.findDOMNode(this.semanticForm);

    // eslint-disable-next-line no-underscore-dangle
    form.__submit__.click();

    // if (form.checkValidity()) {
    //   form.onSubmit();
    // }
  }

  handleSubmitPopup = () => {
    this.setState({ showPopup: true });
    this.timer = setTimeout(() => {
      this.setState({
        data: this.props.initialData,
        showPopup: false,
      });
    }, 2500);
  }

  render() {
    console.log("current state data", JSON.stringify(this.state));
    const { children, ...other } = this.props;
    return (
      <div>
        {this.state.showPopup ?
          <Message info>
            <Message.Header>{this.state.data.name ? `${this.state.data.name}  Successfully added` : 'Successfully added' }</Message.Header>
          </Message> : null}
        <Form ref={(node) => { this.semanticForm = node; }} onSubmit={this.onSubmit} {...other}>
          {children}
          <input name="__submit__" style={{ position: 'absolute', width: 0, height: 0, border: 'none', padding: 0 }} tabIndex={-1} type="submit" value="Submit" />
        </Form>
      </div>
    );
  }
}

SchemaForm.propTypes = {
  initialData: PropTypes.shape({}),
  children: PropTypes.oneOfType(PropTypes.node, PropTypes.arrayOf(PropTypes.node)).isRequired,
  id: PropTypes.number,
  model: PropTypes.string.isRequired,
  api: PropTypes.shape({
    insert: PropTypes.func,
    update: PropTypes.func,
  }).isRequired,
};

SchemaForm.defaultProps = {
  initialData: {},
  id: null,
};

SchemaForm.childContextTypes = {
  getSchemaValue: PropTypes.func.isRequired,
  updateSchemaValue: PropTypes.func.isRequired,
  triggerSubmit: PropTypes.func.isRequired,
};

export const connect = (InputComponent) => {
  const ConnectedInput = (props, context) => {
    if (props.required) {
      // context.setRequiredField(props.name);
    }
    //console.log('props in input field', props.name, props.options,JSON.stringify(context.getSchemaValue(props.name)));
    const value = context.getSchemaValue(props.name);
    return (
      <InputComponent
        {...props}
        value={value}
        onChange={(e, { name, value }) => context.updateSchemaValue(name, value)}
      />
    );
  };

  ConnectedInput.propTypes = {
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
  };

  ConnectedInput.defaultProps = {
    required: false,
  };

  ConnectedInput.contextTypes = {
    getSchemaValue: PropTypes.func.isRequired,
    updateSchemaValue: PropTypes.func.isRequired,
    required: false,
  };

  return ConnectedInput;
};

SchemaForm.Input = connect(Form.Input);
SchemaForm.DropDown = connect(Form.Dropdown);

SchemaForm.ModelDropDown = reduxConnect((state, ownProps) => ({
  options: state[ownProps.model].map(record => ({
    value: record.id,
    text: record[ownProps.textField],
  })),
}))(SchemaForm.DropDown);

SchemaForm.ModelDropDown.propTypes = {
  model: PropTypes.string.isRequired,
  textField: PropTypes.string,
};

SchemaForm.ModelDropDown.defaultProps = {
  textField: 'name',
};

const ReduxLabel = reduxConnect((state, ownProps) => ({
  value: ownProps.value ? state[ownProps.model].find(r => r.id === ownProps.value)[ownProps.textField] : null,
}))(({ value }) => (
  <Label>{value}</Label>
));

const SchemaLink = ({ link, model, textField }, context) => {
  const value = context.getSchemaValue(link);
  if (!model) {
    return (
      <Label>{value}</Label>
    );
  }
  return (
    <ReduxLabel model={model} textField={textField} value={value} />
  );
};

SchemaLink.contextTypes = {
  getSchemaValue: PropTypes.func.isRequired,
};

SchemaLink.propTypes = {
  link: PropTypes.string.isRequired,
  model: PropTypes.string,
  textField: PropTypes.string,
};

SchemaLink.defaultProps = {
  model: null,
  textField: 'name',
};


SchemaForm.Label = SchemaLink;

const mapStateToProps = (state, ownProps) => ({
  initialData: ownProps.id ? (
    state[ownProps.model].find(record => record.id === ownProps.id)
  ) : ownProps.defaultValues,
});
const mapDispatchToProps = dispatch => ({
  insertItem: (data, tableName) => dispatch(insertItem(data, tableName)),
  updateItem: (tableName, id, record) => dispatch(updateItem(tableName, id, record)),
});

SchemaForm.Submit = ({ title, ...other }, context) => (
  <Form.Button
    onClick={() => {
      context.triggerSubmit();
    }}
    primary
    {...other}
  >
    {title}
  </Form.Button>
);

SchemaForm.Submit.propTypes = {
  title: PropTypes.string.isRequired,
};

SchemaForm.Submit.contextTypes = {
  triggerSubmit: PropTypes.func.isRequired,
};

export default reduxConnect(mapStateToProps, mapDispatchToProps, undefined, { withRef: true })(SchemaForm);
