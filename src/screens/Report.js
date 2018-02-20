import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Segment, Table, Input, Dropdown, Checkbox } from 'semantic-ui-react';
import moment from 'moment';
import numeral from 'numeral';

import { withOptions } from '../components/schema';

const ItemType = withOptions(Dropdown, 'ItemType', 'name');

class Report extends Component {
  state = {
    end: moment().format('YYYY-MM-DD'),
    start: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    itemType: '',
    loading: false,
    data: [],
    hideZero: false,
  }

  componentDidUpdate(prevProps, prevState) {
    const { itemType, start, end } = this.state;
    if (
      end !== prevState.end ||
      start !== prevState.start ||
      itemType !== prevState.itemType
    ) {
      this.getData();
    }
  }

  async getData() {
    const { api } = this.props;
    const { itemType, start, end } = this.state;

    this.setState({ loading: true });
    try {
      const res = await api.extractSales(itemType, start, end);
      console.log(res);
      this.setState({
        loading: false,
        data: res,
      });
    } catch (err) {
      this.setState({
        loading: false,
        data: [],
      });
    }
  }

  render() {
    const {
      start, end, itemType, loading, data, hideZero,
    } = this.state;

    const totalSales = data.reduce((res, item) => res + item.amount, 0);

    return (
      <Container fluid>
        <Segment.Group vertical>
          <Segment>
            <Segment.Group horizontal raised>
              <Segment compact size="mini">
                <Input
                  type="date"
                  label="From"
                  value={start}
                  onChange={(e, d) => this.setState({ start: d.value })}
                />
              </Segment>
              <Segment compact size="mini">
                <Input
                  type="date"
                  label="To"
                  value={end}
                  onChange={(e, d) => this.setState({ end: d.value })}
                />
              </Segment>
              <Segment>
                <ItemType
                  value={itemType}
                  onChange={(e, d) => this.setState({ itemType: d.value })}
                />
              </Segment>
              <Segment>
                <Checkbox
                  label="Hide Zero"
                  checked={hideZero}
                  onChange={(e, d) => this.setState({ hideZero: d.checked })}
                />
              </Segment>
            </Segment.Group>
          </Segment>
          <Segment loading={loading}>
            <Table selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>SN</Table.HeaderCell>
                  <Table.HeaderCell>Menu Item</Table.HeaderCell>
                  <Table.HeaderCell>Sales Qty</Table.HeaderCell>
                  <Table.HeaderCell textAlign="right">Sales Amount</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.map((r) => {
                  if (!hideZero || r.units > 0) {
                    return (
                      <Table.Row key={r.sn}>
                        <Table.Cell>{r.sn}</Table.Cell>
                        <Table.Cell>{r.item}</Table.Cell>
                        <Table.Cell>{numeral(r.qty * r.units).format('0,0')} {r.unit}</Table.Cell>
                        <Table.Cell textAlign="right">{numeral(r.amount).format('0,0')}</Table.Cell>
                      </Table.Row>
                    );
                  }
                  return null;
                })}
              </Table.Body>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell colSpan={3} textAlign="right">Total Sales</Table.HeaderCell>
                  <Table.HeaderCell textAlign="right">{numeral(totalSales).format('0,0')}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>
          </Segment>
        </Segment.Group>
      </Container>
    );
  }
}

Report.propTypes = {
  api: PropTypes.shape({
    extractSales: PropTypes.func,
  }).isRequired,
};

export default Report;
