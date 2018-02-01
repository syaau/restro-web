export default function (socket) {
  return function placeOrder(tableNo, orderItems) {
    return socket.rpc('placeOrder', tableNo, orderItems);
  };
}
