import React, { Component } from 'react';
import { Button, Modal, Segment, Table, Icon, Dropdown, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label/Label';

class ItemFormModal extends Component {
  constructor(props) {
    super(props);
    // const {
    //   , price, type, quantity, threshold,
    // } = props;

    console.log(props);

    this.state = {
      tableNo: null,
      itemId: null,
      quantity: null,
      totalOrderItem: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      name, price, type, quantity, threshold,
    } = nextProps;
  }
  tableNumber() {
    return this.props.tables.map(table => {
      return{
       'key':table.id,
       'value': table.id,
       'text': table.id
      }
    })
  }

  itemName() {
    return this.props.items.map(item => {
    return{
       'key': item.id,
       'value': item.id,
       'text': item.name,
      }
    })
  }

  priceCalculator = (id) => {
    const CurrentItem = this.props.items.find(item => item.id === id);
    return CurrentItem;
  }


  changeTableNoHandler = (e, data) => {
    this.setState({
      tableNo: data.value,
    });
  }

  changeItemIdHandler = (e, data) => {
    this.setState({
      itemId: data.value,
    });
  }

  inputChangeHandler = (e) => {
    this.setState({
      quantity: e.target.value,
    });
  }

  updateOrderItem = () => {
    const data = { quantity: this.state.quantity, itemId: this.state.itemId };
    console.log(this.state.totalOrderItem);

    this.setState({
      totalOrderItem: [...this.state.totalOrderItem, data],
      quantity: 0,
      itemId: 0,
    });
  }

  deleteOrderItem = (id) => {
    this.setState({
      totalOrderItem: this.state.totalOrderItem.filter(item => item.itemId !==id)}
    )}

  render() {
    console.log('Current Item =', JSON.stringify(this.priceCalculator(1)));
    console.log('TOTALITEM ADDED IN ARRAY',JSON.stringify(this.state.totalOrderItem));
    console.log('NEW TABLE DATA FOR NUMBER',this.state.tableNo);
    console.log("curent table data", JSON.stringify(this.itemName()));
    return (
      <div>
        <Modal
          open={this.props.visible}
        >
          <Modal.Header>
            Order Items...
          </Modal.Header>
          <Modal.Content>
            <Table celled inverted selectable>
              <Table.Header>
                <Table.Row textAlign="center">
                  <Table.HeaderCell colSpan="6">
                    <Label pointing='right' size='big'>Table No</Label>
                    <Dropdown
                      placeholder='0'
                      compact
                      selection
                      options={this.tableNumber()}
                      onChange={this.changeTableNoHandler}
                    />

                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Qty.</Table.HeaderCell>
                  <Table.HeaderCell>Price</Table.HeaderCell>
                  <Table.HeaderCell>Total</Table.HeaderCell>
                  <Table.HeaderCell>Edit</Table.HeaderCell>
                  <Table.HeaderCell>Delete</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.totalOrderItem.map(item => (
                <Table.Row key={item.ItemId}>
                  <Table.Cell>{this.priceCalculator(item.itemId).name}</Table.Cell>
                  <Table.Cell>{item.quantity}</Table.Cell>
                  <Table.Cell>{this.priceCalculator(item.itemId).price}</Table.Cell>
                  <Table.Cell>{this.priceCalculator(item.itemId).price * item.quantity}</Table.Cell>
                  <Table.Cell>
                    <Icon
                      size="big"
                      color="green"
                      name="edit"
                      link
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Icon
                      size="big"
                      color="red"
                      name="delete"
                      link
                      onClick={() => this.deleteOrderItem(item.itemId)}
                    />
                  </Table.Cell>
                </Table.Row>
            ))
          }
            </Table.Body>
            <Table.Footer>
              <Table.Row textAlign="center">
                <Table.HeaderCell colSpan="6" >
                  <div className="order-table-footer">
                    <div className="order-table-footer-child">
                      <div>
                        <Label size='big' pointing='right'>Item</Label>
                        <Dropdown
                          placeholder='Select Item'
                          value={this.state.itemName}
                          compact
                          selection
                          options={this.itemName()}
                          onChange={this.changeItemIdHandler}
                        />
                      </div>
                      <div>
                        <Label  size='big' pointing='right'>Quantity</Label>
                        <Input type='text' value={this.state.quantity} onChange={this.inputChangeHandler} />
                      </div>
                      <div className='add-button'>
                        <Icon
                          size="huge"
                          color="green"
                          name="add circle"
                          link
                          onClick={this.updateOrderItem}
                        />
                      </div>
                    </div>
                  </div>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
          </Modal.Content>
          <Modal.Actions>
            <Button
              positive
              labelPosition="right"
              icon="checkmark"
              content="Save"
              onClick={() => this.props.onClose(false)}
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tables: state.tables,
    items: state.items,
  };
};

// const mapDispatchToProps= (dispatch) => {
//   return{
//     addOrderITem: () => dispatch(add)
//   }
// }


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
