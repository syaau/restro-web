import axios from 'axios';
import './../config/';
import { ENDPOINT } from './../config/development';

export default function billPrint(orderId) {
  return async (dispatch, getState) => {
    try {
      const order = getState().orders.find(o => o.id === orderId);
      const orderItems = getState().orderItems.filter(o => o.orderId === orderId);

      if (order.status !== 'billed') {
        await axios.put(`${ENDPOINT}/orders/${order.id}`, {
          status: 'billed',
        });

        orderItems.map(async (orderItem) => {
          const item = getState().items.find(i => i.id === orderItem.itemid);
          await axios.put(`${ENDPOINT}/items/${orderItem.itemId}`, {
            quantity: item.quantity - orderItem.quantity,
          });
        });
      }
    } catch (e) {
      console.error(e);
    }
  };
}
