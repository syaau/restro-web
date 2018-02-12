import axios from 'axios';
import config from '../config';

// function createAction(socket, actionName) {
//   return (...args) => {
//     socket.send(JSON.stringify([actionName, [args]]));
//   }
// }

// // const actions = {
//   placeOrder: createAction(socket, 'placeOrder'),
//   updateOrder: createAction(socket, 'updateOrder'),
//   getItems: createAction(socket, 'getItems'),
// };
// const socket = new WebSocket(url);
// socket.on('message', (data) => {
//   store.dispatch(JSON.parse(data));
// });
// socket.on('close', () => {
// });
/**
 *
 * @param {*} tableNo The table number where the order was placed
 * @param {*} items An array of items ordered ({ itemId, qty })
 */
export default function placeOrder(tableNo, items) {
 // socket.send(JSON.stringify(['placeOrder', [tableNo, items]]));
 console.log('Place orderMethod called', JSON.stringify(items));

  return async (dispatch, getState) => {
    try {
      const order = (await axios.post(`${config.ENDPOINT}orders`, { tableNo, status: 'pending' })).data;
      const orderItems = await Promise.all(items.map(async (item) => {
        const response = await axios.post(`${config.ENDPOINT}orderItems`, {
          orderId: order.id,
          itemId: item.itemId,
          quantity: item.quantity,
          rate: item.rate,
        });
        return response.data;
      }));

      console.log('dispatching add-multiplse');

      dispatch({
        type: 'ADD_MULTIPLE',
        tableName: 'orderItems',
        payload: orderItems,
      });

      dispatch({
        type: 'ADD_MULTIPLE',
        tableName: 'orders',
        payload: [order],
      });
    } catch (e) {
      console.error(e);
    }
  };
}
