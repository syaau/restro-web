import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'semantic-ui-react';
import SchemaForm from './SchemaForm';

class SchemaModal extends Component {
  form = null;

  render() {
    const {
      open, model, title, onClose, ...other
    } = this.props;
    console.log('Modal', other);
    return (
      <Modal open={open} size="mini" dimmer={false}>
        <Modal.Header>{title}</Modal.Header>
        <Modal.Content>
          <SchemaForm
            model={model}
            ref={(node) => {
              if (node) {
                this.form = node.getWrappedInstance();
              } else {
                this.form = null;
              }
            }}
            {...other}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={() => this.form.submit()}>Add</Button>
          <Button negative onClick={onClose}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

SchemaModal.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SchemaModal;
