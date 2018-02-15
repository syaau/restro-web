import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Table, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import getRecords from '../../reducers/getRecords';

class ReconciliationStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.records,
    };
  }

  inputValue = (id) => {
    return this.state.data.find(item => item.id === id).stock;
  }

  inputChangeHandler = id => (e, data) => this.setState(prevState => ({
    data: prevState.data.map(item => (item.id !== id ? item : ({
      ...item,
      stock: data.value,
    }))),
  }));

  filteredArray = () => {
    return this.state.data.map(item => (item.threshold ? { itemId: item.id, stock: item.stock } : { itemId: item.id, stock: 0 }));
  }
  render() {
    console.log('data in Reconciliation', JSON.stringify(this.state.data), JSON.stringify(this.filteredArray()));
    return (
      <Modal
        open={this.props.open}
        dimmer={false}
        size="large"
      >
        <Modal.Header >Reconcile Stock</Modal.Header>
        <Modal.Content style={{ overflow: 'scroll', height: '500px' }}>
          <Table celled selectable compact="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Stock</Table.HeaderCell>
                <Table.HeaderCell> New Stock</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body >
              {this.props.recordShow.map((record) => {
                return (
                  <Table.Row key={record.id}>
                    <Table.Cell>{record.name}</Table.Cell>
                    <Table.Cell>{record.stock}</Table.Cell>
                    <Table.Cell> <Input size="mini" type="number" value={this.inputValue(record.id)} name={record.id} onChange={this.inputChangeHandler(record.id)} /></Table.Cell>
                  </Table.Row>
                  );
              })}
            </Table.Body>
          </Table>
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={() => this.props.onSuccess(this.filteredArray())}>Save</Button>
          <Button negative onClick={() => this.props.onClose()}>Close</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

ReconciliationStock.propTypes = {
  records: PropTypes.arrayOf.isRequired,
  recordShow: PropTypes.arrayOf.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
const mapStateToProps = state => ({
  recordShow: getRecords(state, { schema: 'Item' }).filter(item => item.threshold),
  records: getRecords(state, { schema: 'Item' }),
});

export default connect(mapStateToProps)(ReconciliationStock);
