import React,{Component} from 'react';
import { Label, Input, Icon } from 'semantic-ui-react';
import PropsTypes from 'prop-types';

class AddCustomItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemType: 'custom',
    };
  }

  changeInputHandler = (field) => {
    return (e, data) => (
      this.setState({
        [field]: data.value,
      })
    );
}

  render() {
    console.log(this.state);
    return (
      <div className="add-custom-item">
        <div>
          <Label pointing="right" size="big"> Item </Label>
          <Input type="text" value={this.state.name} onChange={this.changeInputHandler('name')}  />
        </div>
        <div>
          <Label pointing="right" size="big">Qty:</Label>
          <Input type="number" value={this.state.quantity} onChange={this.changeInputHandler('quantity')} />
        </div>
        <div>
          <Label pointing="right" size="big">Rate</Label>
          <Input type="number" value={this.state.price} onChange={this.changeInputHandler('price')} />
        </div>
        <Icon
          size="big"
          link
          name="add circle"
          color="green"
          onClick={() => this.props.onSuccess(this.state)}
        />
      </div>
    );
  }
}

AddCustomItem.propTypes = {
  onSuccess: PropsTypes.func.isRequired,
};
export default AddCustomItem;