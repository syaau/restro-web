const actions = [
  'placeOrder',
  'updateOrder',
  'registerUser',
  'moveTable',
  'printOrder',
  'deleteTable',
];

export default function createActions(socket) {

  return actions.reduce((res, action) => ({
    ...res,
    [action]: (...args) => socket.rpc(action, ...args),
  }), {});

  // return {
  //   placeOrder: (tableNo, orderItems) => socket.rpc('orderItems', tableNo, orderItems),
  //   updateOrder: (orderId, tableNo, orderItems) => socket.rpc('updateOrder', tableNo, orderItems),
  //   deleteTable: () => socket.rpc('deletTable', ),
  // };
}
