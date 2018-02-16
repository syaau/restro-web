import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import StockWatch from './../components/StockWatch';
import Orders from './../components/Orders';
import ExtraMenu from './../components/TableContainer';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { api } = this.props;
    return (
      <Grid style={{ marginTop: '100px' }} centered verticalAlign="top" columns={3} rows={2}>
        <Grid.Row>
          <Grid.Column style={{ margin: '50px', minWidth: '400px' }}>
            <Orders api={api} />
          </Grid.Column>
          <Grid.Column style={{ margin: '50px', minWidth: '400px' }}>
            <StockWatch api={api} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={ {marginTop: '200px', minWidth: '1000px'}}>
          <ExtraMenu api={api} />
        </Grid.Row>
      </Grid>
    );
  }
}

Admin.propTypes = {
  api: PropTypes.shape({}).isRequired,
};

export default connect()(Admin);
