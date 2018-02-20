import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment, Menu } from 'semantic-ui-react';
import MenuItems from './MenuItems';
import AddUser from './forms/AddUser';
import TableContainer from './TableContainer';
import { SchemaModal } from './../components/schema';


const style = {
  width: '100%', marginTop: '300px', marginBottom: '100px',
};
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
  handleMenuClick = (activeMenuItem) => {
    this.setState({ activeItem: activeMenuItem });
    switch (activeMenuItem) {
      case 'table_watch':
        this.setState({
          showTable: true,
          menuItems: false,
          addUser: false,
        });
        break;
      case 'menu_item':
        this.setState({
          showTable: false,
          menuItems: true,
          addUser: false,
        });
        break;
      case 'add_user':
        this.setState({
          showTable: false,
          menuItems: false,
          addUser: true,
        });
        break;
      default:
        break;
    }
  }

  render() {
    const { activeItem } = this.state;
    const { onLogout, showReport } = this.props;
    return (
      <div style={style}>
        <Segment inverted >
          <Menu inverted pointing secondary >
            <Menu.Item name="table watch" active={activeItem === 'table_watch'} onClick={() => this.handleMenuClick('table_watch')} />
            <Menu.Item name="menu items" active={activeItem === 'menu_item'} onClick={() => this.handleMenuClick('menu_item')} />
            {this.props.showAddUser &&
            <Menu.Item name="add user" active={activeItem === 'add_user'} onClick={() => this.handleMenuClick('add_user')} />
            }
            <Menu.Item name="log  out" active={activeItem === 'log out'} onClick={onLogout} />
            {this.props.showReport &&
              <Menu.Item name="report" active={activeItem === 'report'} onClick={() => window.open('/report', '_blank')} />
            }
          </Menu>
        </Segment>
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

      </div>
    );
  }
}

FooterMenu.propTypes = {
  onLogout: PropTypes.func.isRequired,
  showAddUser: PropTypes.bool.isRequired,
  showReport: PropTypes.bool,
  api: PropTypes.shape({
    insertUser: PropTypes.func.isRequired,
  }).isRequired,
};

FooterMenu.defaultProps = {
  showReport: false,
};

export default FooterMenu;
