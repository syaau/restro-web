import axios from 'axios';
import './../config/';
import { ENDPOINT } from './../config/development';

export default function rotateTable(data, tables) {
console.log('rotating action called', tables + JSON.stringify(data));
  return async (dispatch, getState) => {
    try {
      const currentState = getState();
      const tableTobeUpdated = currentState.tables.find(table => table.id === data.id);
      console.log("rotate table update data before",JSON.stringify(tableTobeUpdated));
      tableTobeUpdated.rotationAngle = data.rotationAngle;
      console.log("rotate table update data after", JSON.stringify(tableTobeUpdated));
      const response = await axios.put(`${ENDPOINT}${tables}/${data.id}/`, tableTobeUpdated);
      dispatch({
        type: 'ROTATE_TABLE',
        tableName: tables,
        payload: data,
      });
    } catch (e) {
      console.error(e);
    }
  };
}

