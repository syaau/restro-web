import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { Modal, Button, Message } from 'semantic-ui-react';

class SchemaModal extends Component {
  state = {
    message: null,
    messageType: '',
  };

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  onSave = () => {
    const { onClose, closeOnSave } = this.props;

    if (closeOnSave) {
      onClose(true);
    }
  }

  submit = () => {
    // eslint-disable-next-line react/no-find-dom-node
    const button = findDOMNode(this.submitNode);
    button.click();
  }

  showMessage = (message, type) => {
    this.setState({
      message,
      messageType: type,
    });

    // Clear any existing timer
    if (this.timer) {
      clearTimeout(this.timer);
    }

    // Create a new timer to hide the message
    this.timer = setTimeout(() => {
      this.timer = null;
      this.setState({
        message: '',
        messageType: null,
      });
    }, 5000);
  }

  submitButton = () => {
    const invisible = {
      position: 'absolute',
      width: 0,
      height: 0,
      border: 'none',
      padding: 0,
    };

    return (
      <input
        ref={(node) => { this.submitNode = node; }}
        name="__submit__"
        style={invisible}
        tabIndex={-1}
        type="submit"
        value="Submit"
      />
    );
  }

  render() {
    const {
      title, open, size, trigger, form, onClose, closeOnSave, ...other
    } = this.props;

    const { message, messageType } = this.state;

    const Form = form;

    return (
      <Modal dimmer={false} open={open} size={size} trigger={trigger}>
        <Modal.Header>{title}</Modal.Header>
        <Modal.Content>
          { message &&
            <Message
              success={messageType === 'success'}
              negative={messageType === 'error'}
              attached
              content={message}
            />
          }
          <Form {...other} onSuccess={this.onSave} __submit__={this.submitButton()} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.submit} primary>Save</Button>
          <Button onClick={onClose} negative>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

SchemaModal.propTypes = {
  trigger: PropTypes.element,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  form: PropTypes.func.isRequired,
  closeOnSave: PropTypes.bool,
  size: PropTypes.string.isRequired,
};

SchemaModal.defaultProps = {
  trigger: undefined,
  closeOnSave: true,
};

export default SchemaModal;
