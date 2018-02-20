import React, { Component } from 'react';
import { Button, Modal, Table, Icon, Dropdown, Input, Label, Checkbox, Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import AddCustomItem from './../AddCustomItem';
import insertItem from './../../actions/insertItemData';

import config from '../../config';

class OrderItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableId: props.tableId,
      orderItems: props.orderItems,
      discount: props.discount,
      serviceCharge: props.serviceCharge,
      vat: props.vat,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      tableId: nextProps.tableId,
      orderItems: nextProps.orderItems,
      discount: nextProps.discount,
      serviceCharge: nextProps.serviceCharge,
      vat: nextProps.vat,
    });
  }

  changeHandler = (name, checkbox = false) => ({
    onChange: (e, data) => {
      this.setState({
        [name]: checkbox ? data.checked : data.value,
      });
    },
    [checkbox ? 'checked' : 'value']: this.state[name],
  })

  tableNumber() {
    return this.props.tables.map((table) => {
      return {
        value: table.id,
        text: table.name,
      };
    });
  }

  changeTableNoHandler = (e, data) => {
    this.setState({
      tableId: data.value,
    });
  }

  insertOrderItem = (menuItem) => {
    this.setState(prevState => ({
      orderItems: prevState.orderItems.concat(menuItem),
    }));
  }

  deleteOrderItem = (id) => {
    this.setState({ orderItems: this.state.orderItems.filter(item => item.menuItemId !== id) });
  }

  render() {
    const {
      discount, serviceCharge, vat, orderItems,
    } = this.state;
    let total = orderItems.reduce((res, item) => res + (item.qty * item.rate), 0);
    let discountValue = 0;
    if (discount) {
      if (typeof discount === 'string' && discount.endsWith('%')) {
        discountValue = ((parseFloat(discount) / 100) * total);
      } else {
        discountValue = parseFloat(discount);
      }
      total -= discountValue;
    }

    if (serviceCharge) {
      // Add 10% service charge
      total += (total * config.SERVICE_CHARGE);
    }
    if (vat) {
      total += (total * config.VAT);
    }

    return (
      <Modal
        open={this.props.visible}
        dimmer={false}
      >
        <Modal.Header>
          Order
        </Modal.Header>
        <Modal.Content>
          <Table celled selectable compact >
            <Table.Header>
              <Table.Row textAlign="center">
                <Table.HeaderCell>
                  <Label pointing="right" size="big">Table No</Label>
                  <Dropdown
                    value={this.state.tableId}
                    placeholder="0"
                    compact
                    selection
                    options={this.tableNumber()}
                    onChange={this.changeTableNoHandler}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Checkbox label="Service Charge" {...this.changeHandler('serviceCharge', true)} />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Checkbox label="VAT" {...this.changeHandler('vat', true)} />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Input label="Discount" size="tiny" fluid {...this.changeHandler('discount')} />
                </Table.HeaderCell>
                <Table.HeaderCell>
                  <Input label="Total" size="tiny" fluid readOnly value={numeral(total).format('0,0')} />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Qty.</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
                <Table.HeaderCell>Delete</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.orderItems.map(orderItem => ({
                ...this.props.menuItems[orderItem.menuItemId],
                ...orderItem,
              })).map((item, idx) => (
                <Table.Row key={`${item.menuItemId}-${idx}`}>
                  <Table.Cell>{item.name || item.menuItemId}</Table.Cell>
                  <Table.Cell>{item.qty}</Table.Cell>
                  <Table.Cell>{item.rate}</Table.Cell>
                  <Table.Cell>{item.qty * item.rate}</Table.Cell>
                  <Table.Cell>
                    <Icon
                      size="big"
                      color="red"
                      name="delete"
                      link
                      onClick={() => this.deleteOrderItem(item.menuItemId)}
                    />
                  </Table.Cell>
                </Table.Row>
          ))}
            </Table.Body>
            <Table.Row>
              <Table.Cell colSpan="6" >
                <Grid>
                  <AddCustomItem menuItems={this.props.menuItems} onSuccess={data => this.insertOrderItem(data)} />
                </Grid>
              </Table.Cell>
            </Table.Row>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            labelPosition="right"
            icon="checkmark"
            disabled={!(this.state.tableId && this.state.orderItems.length > 0)}
            content="Save"
            onClick={() => {
              if (this.state.tableId && this.state.orderItems.length > 0) {
                if (this.props.orderId) {
                  // this.context.api.updateOrder();
                  this.props.api.updateOrder(this.props.orderId, this.state.tableId, orderItems, discountValue, serviceCharge, vat);
                } else {
                  this.props.api.placeOrder(this.state.tableId, orderItems, discountValue, serviceCharge, vat);
                }
                this.props.onClose();
              }
            }}
          />
          <Button negative content="Cancel" onClick={this.props.onClose} />
        </Modal.Actions>
      </Modal>
    );
  }
}

OrderItem.contextTypes = {
  // api: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const res = {
    menuItems: state.schema.MenuItem.reduce((r, item) => ({ ...r, [item.id]: item }), {}),
    tables: state.schema.Table,
    discount: 0,
    serviceCharge: config.SERVICE_CHARGE_DEFAULT,
    vat: config.VAT_DEFAULT,
  };

  if (ownProps.orderId) {
    const order = state.schema.Order.find(o => o.id === ownProps.orderId);
    console.log('VAT', order.vat);
    return {
      ...res,
      discount: order.discount || 0,
      serviceCharge: !!order.serviceCharge,
      vat: !!order.vat,
      tableId: order.tableId,
      orderItems: order.items || [],
    };
  }

  return {
    ...res,
    tableId: null,
    orderItems: [],
  };
};

const mapDispatchToProps = dispatch => ({
  insertItem: (data, tableName) => dispatch(insertItem(data, tableName)),
});

OrderItem.propTypes = {
  api: PropTypes.shape({
    placeOrder: PropTypes.func,
    updateOrder: PropTypes.func,
  }).isRequired,
  menuItems: PropTypes.oneOfType([PropTypes.arrayOf, PropTypes.object]).isRequired,
  tables: PropTypes.oneOfType([PropTypes.arrayOf, PropTypes.object]).isRequired,
  visible: PropTypes.bool.isRequired,
  orderId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderItem);
