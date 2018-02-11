import axios from 'axios';
import config from '../config';

export default function updateOrder(orderId, tableNo, orderItems) {
  console.log('update order method called', orderId, tableNo, orderItems);
  return async (dispatch, getState) => {
    try {
      // get all the old items
      const oldItems = getState().orderItems.filter(orderItem => orderItem.orderId === orderId);

      // Delete individually
      await Promise.all(oldItems.map(async (orderItem) => {
        await axios.delete(`${config.ENDPOINT}orderItems/${orderItem.id}`);
        return orderItem.id;
      }));

      // Insert the updated items
      const newItems = await Promise.all(orderItems.map(async (orderItem) => {
        const response = await axios.post(`${config.ENDPOINT}orderItems`, {
          itemId: orderItem.itemId,
          orderId,
          quantity: orderItem.quantity,
          rate: orderItem.rate,
        });
        return response.data;
      }));

      console.log('New Items', newItems);

      // now update the table number
      await axios.put(`${config.ENDPOINT}orders/${orderId}`, {
        tableNo,
      });

      dispatch({
        tableName: 'orders',
        type: 'DATA_UPDATED',
        payload: {
          id: orderId,
          tableNo,
        },
      });

      dispatch({
        tableName: 'orderItems',
        type: 'DELETE_MULTIPLE',
        payload: oldItems.map(o => o.id),
      });

      dispatch({
        tableName: 'orderItems',
        type: 'ADD_MULTIPLE',
        payload: newItems,
      });
    } catch (e) {
      console.error(e.status);
    }
  };
}
