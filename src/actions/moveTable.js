import axios from 'axios';
import './../config/';
import { ENDPOINT } from './../config/development';


export default function moveTable(data, tables) {

  return async (dispatch, getState) => {
    try {
      const currentState = getState();
      const tableTobeUpdated = currentState.tables.find(table => table.id === data.id);
      console.log('data to be updataed in move table', tableTobeUpdated);
      tableTobeUpdated.left = data.left;
      tableTobeUpdated.top = data.top;
      const response = await axios.put(`${ENDPOINT}${tables}/${data.id}/`, tableTobeUpdated);
      dispatch({
        type: 'MOVE_TABLE',
        tableName: tables,
        payload: data,
      });
    } catch (e) {
      console.error(e);
    }
  };
}

