import axios from 'axios';
import config from '../config';

/**
 *
 * @param {*} tableNo The table number where the order was placed
 * @param {*} items An array of items ordered ({ itemId, qty })
 */
export default function placeOrder(tableNo, items) {
  return async (dispatch, getState) => {
    try {
      const order = (await axios.post(`${config.ENDPOINT}orders`, { tableNo })).data;
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
