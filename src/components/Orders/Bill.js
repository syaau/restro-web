import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Table, Button } from 'semantic-ui-react';
import numeral from 'numeral';
import config from '../../config';

const FooterRow = ({ caption, children }) => (
  <Table.Row>
    <Table.Cell colSpan={3} textAlign="right">{caption}</Table.Cell>
    <Table.Cell textAlign="right">{numeral(children).format('0,0')}</Table.Cell>
  </Table.Row>
);

FooterRow.propTypes = {
  caption: PropTypes.string.isRequired,
  children: PropTypes.number.isRequired,
};

const Bill = ({ order, onClose, print }) => (
  <Modal open>
    <Modal.Header>Print Bill</Modal.Header>
    <Modal.Content>
      <Table celled selectable compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Qty</Table.HeaderCell>
            <Table.HeaderCell>Rate</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {order.items.map(item => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.qty}</Table.Cell>
              <Table.Cell>{item.rate}</Table.Cell>
              <Table.Cell textAlign="right">{item.qty * item.rate}</Table.Cell>
            </Table.Row>
          ))}
          <FooterRow caption="SubTotal">{order.subTotal}</FooterRow>
          <FooterRow caption="Discount">{order.discount}</FooterRow>
          <FooterRow caption="Service Charge">{order.serviceCharge}</FooterRow>
          <FooterRow caption="VAT">{order.vat}</FooterRow>
          <FooterRow caption="Total">{order.total}</FooterRow>
        </Table.Body>
      </Table>
    </Modal.Content>
    <Modal.Actions>
      <Button negative content="Cancel" onClick={onClose} />
      <Button
        primary
        labelPosition="right"
        icon="print"
        content="Print"
        onClick={async () => {
          print();
          onClose(true);
        }}
      />
    </Modal.Actions>
  </Modal>
);

Bill.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      qty: PropTypes.number,
      rate: PropTypes.number,
    })),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  print: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const order = state.schema.Order.find(o => o.id === ownProps.id);
  let total = 0;
  const items = order.items.map((item) => {
    total += item.qty * item.rate;
    return {
      ...item,
      name: state.schema.MenuItem.find(m => m.id === item.menuItemId).name,
    };
  });
  const subTotal = total;
  const discount = order.discount || 0;
  const serviceCharge = order.serviceCharge ? (config.SERVICE_CHARGE * (total - discount)) : 0;
  const vat = order.vat ? (config.VAT * ((total - discount) + serviceCharge)) : 0;
  total = (total - discount) + serviceCharge + vat;
  return {
    order: {
      ...order,
      items,
      subTotal,
      discount,
      serviceCharge,
      vat,
      total,
    },
  };
};

export default connect(mapStateToProps)(Bill);
