import axios from 'axios';
import './../config/development';
import { ENDPOINT } from './../config/development';

export default function selectTabledata(tableName) {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${ENDPOINT}${tableName}/`);
      const tableData = response.data;
      dispatch({
        type: 'POP_TABLE_DATA',
        tableName,
        payload: tableData,
      });
    } catch (e) {
      console.error(e);
    }
  };
}
