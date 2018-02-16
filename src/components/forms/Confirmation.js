import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const Confirmation = ({
  visible,
  onClose,
  header,
  message,
}) => (
  <Modal
    size="mini"
    dimmer={false}
    open={visible}
  >
    <Modal.Header>
      {header}
    </Modal.Header>
    <Modal.Content>
      <p>{message}</p>
    </Modal.Content>
    <Modal.Actions>
      <Button
        negative
        onClick={() => onClose(false)}
      >
        No
      </Button>
      <Button
        primary
        labelPosition="right"
        icon="checkmark"
        content="Yes"
        onClick={() => onClose(true)}
      />
    </Modal.Actions>
  </Modal>
);

Confirmation.propTypes = {
  visible: PropTypes.bool.isRequired,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  header: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Confirmation;
