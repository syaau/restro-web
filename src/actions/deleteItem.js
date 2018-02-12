import axios from 'axios';
import config from './../config';

export default function deleteItem(id, tableName) {
  console.log('deleted action called', id, tableName);
  return async (dispatch) => {
    try {
      await axios.delete(`${config.ENDPOINT}${tableName}/${id}`);
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
