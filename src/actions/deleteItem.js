import axios from 'axios';
import { ENDPOINT } from './../config/development';

export default function deleteItem(id, tableName) {
  console.log('deleted action called', id, tableName);
  return async (dispatch) => {
    try {
      await axios.delete(`${ENDPOINT}${tableName}/${id}`);
      return dispatch({
        type: 'DATA_DELETED',
        tableName,
        payload: id,
      });
    } catch (e) {
      console.error(e);
    }
  };
}
