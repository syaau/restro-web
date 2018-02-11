import { Button } from 'semantic-ui-react';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SchemaForm from './SchemaForm';
import AddItem from './AddItem';
import SchemaModal from './SchemaModal';

class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addedItemId: 2,
      showAddItem: false,
    };
  }

  render() {
    const { ...other } = this.props;
    return (
      <SchemaModal model="users" title="Enter Users Details" {...other}>
        <div className="drop-down-menu">
          <SchemaForm.DropDown
            required
            label="Select Type"
            options={
              [
                { value: 'super', text: 'super' },
                { value: 'normal', text: 'normal' },
              ]
            }
            optionsplaceholder="Type"
            name="userType"
            search
            selection
          />
        </div>
        <div className="form-input-field">
          <SchemaForm.Input labelPosition="left" required label="Username" placeholder="Username" name="username" />
          <div className="menu-item-form-quantity">
            <SchemaForm.Input type="text" required label="PassWord" placeholder="PassWord" name="password" />
          </div>
        </div>
      </SchemaModal>
    );
  }
}

AddUser.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AddUser;
