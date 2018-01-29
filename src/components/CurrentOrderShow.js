import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Icon } from 'semantic-ui-react';
import PropsTypes from 'prop-types';
import selectTableData from './../actions/selectTabledata';
import DeleteConfirmation from './DeleteConfirmation';
import billPrint from './../actions/billPrint';
import deleteOrderItem from './../actions/deleteItem';
import OrderItemFormModal from './OrderItemFormModal';


class CurrentOrderShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      billStatus: false,
      itemName: '',
      itemquantity: 0,
      itemId: '',
      addOrderItem: false,

    };
  }
  render() {
    return (
      <div>
        <Table celled inverted selectable>
          <Table.Header>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan="5"><h2>Current Orders</h2></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Item</Table.HeaderCell>
              <Table.HeaderCell>Quantity</Table.HeaderCell>
              <Table.HeaderCell>TableNo</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Bill Print</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.currentOrderData.map(item => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.item}</Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>{item.tableNo}</Table.Cell>
                <Table.Cell>{item.status}</Table.Cell>
                <Table.Cell>
                  <Icon
                    size="big"
                    color="green"
                    name="print"
                    link
                    onClick={() => this.setState({
                      billStatus: true,
                      itemName: item.item,
                      itemquantity: item.quantity,
                      itemId: item.id,
                     })}
                  />
                </Table.Cell>
              </Table.Row>
          ))
          }
          </Table.Body>
          <Table.Footer>
            <Table.Row textAlign="center">
              <Table.HeaderCell colSpan="6">
                <Icon
                  size="huge"
                  color="green"
                  name="add circle"
                  link
                  onClick={() => this.setState({ addOrderItem: true })}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        <OrderItemFormModal
          visible={this.state.addOrderItem}
          onSuccess={data => this.props.updateItem(data, this.state.editItemId)}
          onClose={() => this.setState({addOrderItem: false })}
        />
        <DeleteConfirmation
          visible={this.state.billStatus}
          message={<p>Bill Details here...</p>}
          header="Fudo  bill"
          onClose={(remove) => {
            if (remove) {
             this.props.billPrint(this.state.itemName, this.state.itemquantity);
              this.props.deleteOrderItem(this.state.itemId);
              this.setState({ billStatus: false });
            } else {
            this.setState({ billStatus: false });
            }
          }}
        />
      </div>
    );
  }
}

const mapOrderItemsDBdataToProps = (state) => {
  return {
    currentOrderData: state.orderItems,
    itemDetails: state.items,
  };
};
const mapOrderItemDispatchToProps = (dispatch) => {
  dispatch(selectTableData('orderItems'));
  return {
    billPrint: (itemName, itemquantity) => dispatch(billPrint(itemName, itemquantity, 'items')),
    deleteOrderItem: itemId => dispatch(deleteOrderItem(itemId, 'orderItems')),
  };
};
CurrentOrderShow.propTypes = {
  currentOrderData: PropsTypes.arrayOf.isRequired,
  billPrint: PropsTypes.func.isRequired,
  deleteOrderItem: PropsTypes.func.isRequired,
};
export default connect(mapOrderItemsDBdataToProps, mapOrderItemDispatchToProps)(CurrentOrderShow);
