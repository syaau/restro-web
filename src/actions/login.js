import axios from 'axios';
import { ENDPOINT } from './../config/development';

export default function login(username, password) {

  return async (dispatch) => {
    try {
      console.log(axios);
      const response = await axios({
        method: 'post',
        data: {
          username,
          password,
        },
        url: `http://localhost:8080/login`,
      });
      if (response.status === 200) {
        const user = response.data;
        dispatch({
          type: 'USER_LOGIN',
          payload: user,
        });
      }
    } catch (e) {
      dispatch({
        type: 'LOGIN_FAILED',
        payload: 'Invalid username/password',
      });
    }
  };
}
