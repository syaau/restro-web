import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Icon } from 'semantic-ui-react';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import TableObj from './Table';
import insertItemData from '../actions/insertItemData';
import moveTable from './../actions/moveTable';
import selectTabledata from './../actions/selectTabledata';
import deleteItem from './../actions/deleteItem';
import rotateTable from './../actions/rotateTable';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button/Button';

const styles = {
  width: 700,
  margin: 10,
  marginLeft: 80,
  height: 300,
  border: '1px solid black',
  position: 'relative',
};

const tableTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset();
    const left = Math.round(item.left + delta.x);
    const top = Math.round(item.top + delta.y);
    props.moveTable(item.id, left, top);
  },
};
const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
});

class TableContainer extends Component {
  static propTypes = {
    deleteTable: PropTypes.func.isRequired,
    currentTableId: PropTypes.number.isRequired,
    rotateTable: PropTypes.func.isRequired,
    tables: PropTypes.func.isRequired,
    addTable: PropTypes.func.isRequired,
    hideSourceOnDrag: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
    };
  }
  showTableSettingController() {
    return (
      <div>
        <Icon
          link
          color="green"
          name="hide"
          size="big"
          onClick={() => this.showTable()}
        />
        <Icon
          link
          name="delete"
          color="red"
          size="big"
          onClick={() => this.props.deleteTable(this.props.currentTableId)}
        />
        <Icon
          link
          name="repeat"
          color="green"
          size="big"
          onClick={() => this.props.rotateTable(this.props.currentTableId, 90)}
        />
      </div>
    );
  }

  showTable() {
    this.setState({
      showTable: !this.state.showTable,
    });
  }

  render() {
    const { hideSourceOnDrag, connectDropTarget } = this.props;
    const { showTable } = this.state;

    console.log('ishidingsource status', { hideSourceOnDrag });
    const { tables } = this.props;
    console.log('Table Watch', this.state);
    return (
      <div>
        <div className="table-watch-expand">
          <h1>Table Watch</h1>
          <div className="expand button">
            <Button onClick={() => this.setState({ showTable: !this.state.showTable })}>
              {(showTable ? 'Hide' : 'Show')}
            </Button>
          </div>
        </div>
        { showTable &&
          <Table celled inverted selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Table NO</Table.HeaderCell>
                <Table.HeaderCell>Occupancy</Table.HeaderCell>
                <Table.HeaderCell>Total Orders</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tables.map(table => (
                <Table.Row key={table.id}>
                  <Table.Cell>{table.id}</Table.Cell>
                  <Table.Cell>{table.occupancy}</Table.Cell>
                  <Table.Cell>{table.totalOrder}</Table.Cell>
                  <Table.Cell>{table.status}</Table.Cell>
                </Table.Row>
              ))
              }
              <Table.Row textAlign="center">
                <Table.HeaderCell colSpan="4">
                  {this.state.showTable ? connectDropTarget(
                    <div style={styles}>
                      {tables.map((table) => {
                        const {
                          id, left, top, rotationAngle,
                        } = table;
                        return (
                          <div>
                            <TableObj
                              id={id}
                              left={left}
                              top={top}
                              rotationAngle={rotationAngle}
                              hideSourceOnDrag
                            />

                          </div>
                        );
                      })
                      }
                    </div>
                  ) : null}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Body>
            <Table.Footer>
              <Table.Row textAlign="center">
                <Table.HeaderCell colSpan="6">
                  <Icon
                    size="huge"
                    color="green"
                    name="add circle"
                    link
                    onClick={() => this.props.addTable()}
                  />
                  {this.state.showTable ? this.showTableSettingController() : <Icon color="green" size="huge" onClick={() => this.showTable()} name="unhide" />}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
         }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tables: state.tables,
    currentTableId: state.currentTableId,
  };
};

const mapDispatchToProps = (dispatch) => {
  dispatch(selectTabledata('tables'));
  return {
    addTable: () => dispatch(insertItemData({ top: 0, left: 0, rotationAngle: 0 }, 'tables')),
    moveTable: (id, left, top) => dispatch(moveTable({ id, left, top }, 'tables')),
    deleteTable: id => dispatch(deleteItem(id, 'tables')),
    rotateTable: (id, rotationAngle) => dispatch(rotateTable({ id, rotationAngle }, 'tables')),
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(DropTarget(ItemTypes.TABLE, tableTarget, collect)(TableContainer));

