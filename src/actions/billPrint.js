import axios from 'axios';
import './../config/';
import { ENDPOINT } from './../config/development';

export default function billPrint(itemName, itemquantity, tableName) {
  return async (dispatch) => {
    try {
      const respose = await axios.get(`${ENDPOINT}${tableName}?name=${itemName}`);
      const responseData = respose.data;
      const itemTobeUpdated = responseData.find(item => item.name === itemName);
      itemTobeUpdated.quantity -= itemquantity;
      const updataResponse = await axios.put(`${ENDPOINT}${tableName}/${itemTobeUpdated.id}/`, itemTobeUpdated);
      const updatedData = updataResponse.data;
      console.log('billprint data from items table', updatedData);
      dispatch({
        type: 'BIll_PRINTED',
        tableName,
        payload: updatedData,
      });
    } catch (e) {
      console.log('error');
    }
  };
}
