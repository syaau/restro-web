import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import StockWatch from './../components/StockWatch';
import Orders from './../components/Orders';
import FooterMenu from './../components/FooerMenu';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { api, onLogout } = this.props;
    return (
      <Grid stretched style={{ marginTop: '100px' }} centered verticalAlign="top" columns={2} rows={2}>
        <Grid.Row>
          <Grid.Column>
            <Orders api={api} />
          </Grid.Column>
          <Grid.Column>
            <StockWatch api={api} allowPurchase allowItemRemove allowReconcile />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row stretched>
          <FooterMenu api={api} onLogout={onLogout} showAddUser />
        </Grid.Row>
      </Grid>
    );
  }
}

Admin.propTypes = {
  api: PropTypes.shape({}).isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default connect()(Admin);
