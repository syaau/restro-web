import React, { Component } from 'react';
import { Button, Modal, Segment, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class ItemFormModal extends Component {
  constructor(props) {
    super(props);
    const {
      name, price, type, quantity, threshold,
    } = props;

    console.log(props);
    this.state = {
      name,
      price,
      quantity,
      type,
      threshold,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      name, price, type, quantity, threshold,
    } = nextProps;
    this.state = {
      name,
      price,
      quantity,
      type,
      threshold,
    };
  }

  resetInputField() {
    this.setState({
      name: '',
      price: '',
      quantity: '',
      type: '',
      threshold: '',
    });
  }
  inputChangeHandler(field) {
    return (e) => {
      this.setState({
        [field]: e.target.value,
      });
    };
  }

  render() {
    const {
      name, price, quantity, type, threshold,
    } = this.state;
    return (
      <div>
        <Modal
          open={this.props.visible}
        >
          <Modal.Header>
              Enter Item Details..
          </Modal.Header>
          <Modal.Content>
            <Segment>
              <Form>
                <Form.Group unstackable widths={3}>
                  <Form.Input
                    type="text"
                    label="Name"
                    placeholder="Name..."
                    value={name}
                    onChange={this.inputChangeHandler('name')}
                  />
                  <Form.Input
                    type="text"
                    label="Type"
                    placeholder="Type..."
                    value={type}
                    onChange={this.inputChangeHandler('type')}
                  />
                  <Form.Input
                    type="text"
                    label="Threshold"
                    placeholder="Threshold..."
                    value={threshold}
                    onChange={this.inputChangeHandler('threshold')}
                  />
                </Form.Group>
                <Form.Group widths={2}>
                  <Form.Input
                    type="text"
                    label="Quantity"
                    placeholder="Quantity..."
                    value={quantity}
                    onChange={this.inputChangeHandler('quantity')}
                  />
                  <Form.Input
                    type="text"
                    label="Unit Price"
                    placeholder="Unit Price..."
                    value={price}
                    onChange={this.inputChangeHandler('price')}
                  />
                </Form.Group>
                <Button
                  positive
                  type="submit"
                  onClick={() => {
                    this.props.onSuccess(this.state);
                     this.props.onClose(true);
                     this.resetInputField();
                    }}
                >Submit
                </Button>
                <Button
                  negative
                  onClick={() => this.props.onClose(false)}
                >Cancel
                </Button>
              </Form>
            </Segment>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  if (!ownProps.id) {
    return {
      name: '',
      price: 0,
      type: 'Kitchen',
      quantity: 0,
    };
  }

  console.log(ownProps.id);
  return state.items.find(item => item.id === ownProps.id);
};

ItemFormModal.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  threshold: PropTypes.number.isRequired,

};
export default connect(mapStateToProps)(ItemFormModal);
