import connectApi from '../connectApi';

class Cashier extends Component {
  render() {
    return (
      <Button onClick={() => this.props.api.placeOrder(tableNo, orderItems)} title="Order Item"></Button>
    );
  }
}

export default connectApi(Cashier);
