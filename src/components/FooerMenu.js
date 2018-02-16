import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment, Menu, Grid } from 'semantic-ui-react';
import MenuItems from './MenuItems';
import AddUser from './forms/AddUser';
import TableContainer from './TableContainer';
import { SchemaModal } from './../components/schema';

class FooterMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTable: false,
      menuItems: false,
      addUser: false,
      activeItem: null,
    };
  }

  render() {
    const { activeItem } = this.state;
    const { onLogout } = this.props;

    return (
      <Grid centered>
        <Grid.Row>
          <Grid.Column>
            <Segment inverted>
              <Menu inverted pointing secondary >
                <Menu.Item name="table watch" active={activeItem === 'table watch'} onClick={() => this.setState({ showTable: !this.state.showTable, activeItem: 'table watch'})} />
                <Menu.Item name="menu items" active={activeItem === 'menu items'} onClick={() => this.setState({ menuItems: !this.state.menuItems, activeItem: 'menu items' })} />
                {this.props.showAddUser &&
                <Menu.Item name="add user" active={activeItem === 'add user'} onClick={() => this.setState({ addUser: !this.state.addUser, activeItem: 'add user' })} />
                }
                <Menu.Item name="log  out" active={activeItem === 'log out'} onClick={onLogout} />
              </Menu>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          {this.state.menuItems && <MenuItems api={this.props.api} />}
          {this.state.showTable && <TableContainer api={this.props.api} />}
          {this.state.addUser &&
          <SchemaModal
            size="mini"
            remoteApi={this.props.api.insertUser}
            title="Add User"
            open={this.state.addUser}
            form={AddUser}
            onClose={() => this.setState({ addUser: false })}
          /> }
        </Grid.Row>
      </Grid>
    );
  }
}

FooterMenu.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default FooterMenu;
