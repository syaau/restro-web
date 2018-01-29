import axios from 'axios';
import './../config/';
import { ENDPOINT } from './../config/development';

export default function updateData(table, id, record) {
  return async (dispatch) => {
    try {
      const respose = await axios.put(`${ENDPOINT}${table}/${id}/`, record);
      const responseData = respose.data;
      dispatch({
        type: 'DATA_UPDATED',
        tableName: table,
        payload: responseData,
      });
    } catch (e) {
      console.log('error');
    }
  };
}
