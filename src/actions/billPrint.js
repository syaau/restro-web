import axios from 'axios';
import config from './../config';

export default function billPrint(orderId) {
  console.log('bill print method is called', orderId);
  return async (dispatch, getState) => {
    try {
      const order = getState().orders.find(o => o.id === orderId);
      const orderItems = getState().orderItems.filter(o => o.orderId === orderId);
      if (order.status !== 'billed') {
        const updateOrder = await axios.put(`${config.ENDPOINT}orders/${order.id}`, {
          ...order,
          status: 'billed',
        });

        dispatch({
          tableName: 'orders',
          type: 'DATA_UPDATED',
          payload: updateOrder.data,
        });

        // orderItems.map(async (orderItem) => {
        //   const item = getState().items.find(i => i.id === orderItem.itemid);
        //   await axios.put(`${ENDPOINT}/items/${orderItem.itemId}`, {
        //     quantity: item.quantity - orderItem.quantity,
        //   });
        // });
      }
    } catch (e) {
      console.error(e);
    }
  };
}
