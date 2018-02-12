import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Segment } from 'semantic-ui-react';
import { SchemaModal, SchemaGrid } from '../components/schema';
import MenuItemForm from '../components/forms/MenuItem';

class Admin extends Component {
  state = { addMenuItem: false };

  handleOpen = () => this.setState({ addMenuItem: true });

  render() {
    const { addMenuItem } = this.state;
    const { api } = this.props;

    return (
      <div>
        <SchemaGrid
          schema="Item"
          fields={[
            { name: 'name', header: 'Name' },
            { name: 'stock', header: 'Stock' },
            { name: 'threshold', header: 'Threshold' },
          ]}
          title="Stock Watch"
          emptyMessage="No items in database"
          actionButtons={[
            { icon: 'print', action: () => {} },
          ]}
          renderFooter={() => (
            <Segment>
              <Button primary>New Item</Button>
              <Button primary floated="right" onClick={this.handleOpen}>New Menu Item</Button>
            </Segment>
          )}
        />
        { addMenuItem && <SchemaModal
          remoteApi={api.insertItem}
          title="New Menu Item"
          open={addMenuItem}
          form={MenuItemForm}
          onClose={() => this.setState({ addMenuItem: false })}
        />}
      </div>
    );
  }
}

Admin.propTypes = {
  api: PropTypes.shape({}).isRequired,
};

export default Admin;
