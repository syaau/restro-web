import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Message, Button, Popup } from 'semantic-ui-react';

import getRecords from '../../reducers/getRecords';

class SchemaGrid extends Component {
  renderHeader = field => (
    <Table.HeaderCell key={field.name} width={field.width}>{field.header}</Table.HeaderCell>
  );
  renderRow = (record) => {
    const { fields, actionButtons } = this.props;
    return (
      <Table.Row
        key={record.id}
        style={{ background: record.threshold > record.stock ? '#ff6961' : '' }}
      >
        { fields.map(field => this.renderCell(field, record)) }
        { actionButtons.length > 0 && (
          <Table.Cell>
            {actionButtons.map(({
               icon, action, color, hoverMessage,
              }) => (
                <Popup
                  trigger={
                    <Button color={color} key={icon} onClick={() => action(record)} icon={icon} />
                  }
                  content={hoverMessage}
                  hideOnScroll
                />
            ))}
          </Table.Cell>
        )}
      </Table.Row>
    );
  }

  renderCell = (field, record) => (
    <Table.Cell key={field.name}>
      {field.render ? field.render(record) : record[field.name]}
    </Table.Cell>
  );

  render() {
    const {
      schema, title, fields, records, emptyMessage, actionButtons, renderFooter,
    } = this.props;
    const count = fields.length + (actionButtons.length > 0 ? 1 : 0);

    return (
      <Table celled compact="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center" colSpan={count}><h1>{title}</h1></Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            { fields.map(this.renderHeader) }
            { actionButtons.length > 0 && <Table.HeaderCell /> }
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { records.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={count}>
                <Message size="massive">{emptyMessage}</Message>
              </Table.Cell>
            </Table.Row>
          ) : records.map(this.renderRow) }
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell colSpan={count}>
              { renderFooter(schema) }
            </Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}

SchemaGrid.propTypes = {
  schema: PropTypes.string.isRequired, // Used to getRecords
  records: PropTypes.arrayOf(PropTypes.shape).isRequired,
  title: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string.isRequired,
  actionButtons: PropTypes.arrayOf(PropTypes.shape({
    icon: PropTypes.string,
    action: PropTypes.func,
  })).isRequired,
  renderFooter: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    header: PropTypes.string,
    render: PropTypes.func,
  })).isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  records: ownProps.schema === 'Item' ? getRecords(state, ownProps).filter(item => item.threshold) : getRecords(state, ownProps),
});

export default connect(mapStateToProps)(SchemaGrid);
