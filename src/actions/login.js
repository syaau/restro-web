import axios from 'axios';
import Cookies from 'universal-cookie';
import { ENDPOINT } from './../config/development';

const cookeis = new Cookies();

export default function login(username, password) {
  console.log('username and password', username + password);
  return async (dispatch) => {
    try {
      console.log(axios);
      const response = await axios({
        method: 'post',
        data: {
          username,
          password,
        },
        url: `http://localhost:3000/login`,
      });
      if (response.status === 200) {

        const user = response.data;
        cookeis.set('session-id', user.token);
        console.log('data at client side', JSON.stringify(response.data));
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
