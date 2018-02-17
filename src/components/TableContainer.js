import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Icon, Segment, Menu,Popup } from 'semantic-ui-react';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import TableObj from './Table';
import MenuItems from './MenuItems';
import AddUser from './forms/AddUser';
import getRecords from '../reducers/getRecords';
import { SchemaModal } from './../components/schema';
import AddTable from './forms/AddTable';


const styles = {
  width: '100%',
  background: 'black',
  height: 400,
  border: '3px solid blue',
  position: 'relative',
};

const tableTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset();
    const left = Math.round(item.left + delta.x);
    const top = Math.round(item.top + delta.y);
    props.api.updateTable({ left, top, angle: 0 }, item.id);
  },
};
const collect = connectt => ({
  connectDropTarget: connectt.dropTarget(),
});

class TableContainer extends Component {
  static propTypes = {
    deleteTable: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      activeItem: 'home',
      currentTableId: null,
      showEditTable: false,
      addTable: false,
    };
  }
  menuhandleItemClick = (e, { name }) => this.setState({ activeItem: name });
  showTableSettingController() {
    return (
      <div>
        <Popup
          trigger={<Icon
            link
            name="edit"
            color="blue"
            size="big"
            onClick={() => this.setState({ showEditTable: !this.state.showEditTable })}
          />}
          content="Edit Table Name"
          hideOnScroll
        />
        <Popup
          trigger={
            <Icon
              link
              name="delete"
              color="red"
              size="big"
              onClick={() => this.props.api.deleteTable(this.state.currentTableId)}
            />}
          content="Delete Table"
          hideOnScroll
        />

        <Popup
          trigger={
            <Icon
              link
              name="repeat"
              color="blue"
              size="big"
              onClick={() => this.props.api.updateTable({ angle: 90 }, this.state.currentTableId)}
            />}
          content="Rotate Table"
          hideOnScroll
        />

        <Popup
          trigger={
            <Icon
              link
              color="blue"
              name="hide"
              size="big"
              onClick={() => this.showTable()}
            />}
          content="Hide Table Container"
          hideOnScroll
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
    const { connectDropTarget } = this.props;
    const { showTable, activeItem } = this.state;
    const { tables } = this.props;
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Table Name</Table.HeaderCell>
            <Table.HeaderCell>Occupancy</Table.HeaderCell>
            <Table.HeaderCell>Total Orders</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tables.map(table => (
            <Table.Row key={table.id}>
              <Table.Cell>{table.name}</Table.Cell>
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
                      id, left, top, angle, name,
                    } = table;
                    return (
                      <div>
                        <TableObj
                          id={id}
                          name={name}
                          left={left}
                          top={top}
                          currentTableId={tableid => this.setState({ currentTableId: tableid })}
                          rotationAngle={angle}
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
              <Popup
                trigger={
                  <Icon
                    size="huge"
                    color="blue"
                    name="add circle"
                    link
                    onClick={() => this.setState({ addTable: !this.state.addTable })}
                  />
                  }
                content="Add Table"
                hideOnScroll
              />
              {this.state.addTable &&
              <SchemaModal
                remoteApi={this.props.api.insertTable}
                title="Add Table"
                size="mini"
                open={this.state.addTable}
                form={AddTable}
                onClose={() => this.setState({ addTable: false })}
              />}
              {this.state.showTable ? this.showTableSettingController() :
              <Popup
                trigger={
                  <Icon color="blue" size="huge" onClick={() => this.showTable()} name="unhide" />
                  }
                content="Show Table Container"
                hideOnScroll
              />
              }
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
        {this.state.showEditTable &&
        <SchemaModal
          remoteApi={this.props.api.updateTable}
          title="Update Table"
          size="mini"
          id={this.state.currentTableId}
          open={this.state.showEditTable}
          form={AddTable}
          onClose={() => this.setState({ showEditTable: false })
          }
        />
          }
      </Table>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tables: getRecords(state, { schema: 'Table' }),
    currentTableId: state.currentTableId,
  };
};
export default connect(mapStateToProps)(DropTarget(ItemTypes.TABLE, tableTarget, collect)(TableContainer));
