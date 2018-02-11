<<<<<<< HEAD
/* global document */
import React, { Component } from 'react';
import cookie from 'cookie';
import logo from './logo.svg';
import './App.css';
import createSocket, { connectApi } from 'socket.red-client';

import placeOrderFactory from './actions/placeOrder';

const sessionId = cookie.get('session-id');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionId: cookie.get('session-id'),
      online: false,
      user: null,
    };

    this.socket = createSocket(store.dispatch);
    this.api = connectApi(ServerApi, this.socket);

    this.socket.on('connect', () => {
      this.setState({
        online: true,
      });
    });

    this.socket.on('disconnect', () => {
      this.setState({
        online: false,
      });
    });

    this.socket.on('event', (name, data) => {
      if (name === 'user') {
        this.setState({
          user: data,
        });
      }
    });
  }

  getChildContext() {
    return {
      api: this.api,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.sessionId !== nextState.sessionId) {
      this.socket.open(`ws://localhost:8080/${nextState.sessionId}`);
    }

    return true;
  }
=======
import React,{Component} from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import MainApp from './screens/App';
import './App.css';
import PropTypes from 'prop-types';
import selectTableData from './actions/selectTabledata';
import schemaReducer from './reducers/schemaReducer';
import sessionReducer from './reducers/sessionReducer';
import Cookies from 'universal-cookie'
import createSocket,{connectApi} from 'socket.red-client';
import selectTabledata from './actions/selectTabledata';

const cookies = new Cookies();

const store = createStore(combineReducers({
  session: sessionReducer,
  orderItems: schemaReducer('orderItems'),
  tables: schemaReducer('tables'),
  orders: schemaReducer('orders'),
  items: schemaReducer('items'),
  menuItems: schemaReducer('menuItems'),
  purchase: schemaReducer('purchase'),
}), applyMiddleware(thunk));


store.dispatch(selectTableData('items'));
store.dispatch(selectTableData('orders'));
store.dispatch(selectTableData('orderItems'));
store.dispatch(selectTableData('purchase'));
store.dispatch(selectTableData('menuItems'));
store.dispatch(selectTabledata('tables'));
store.dispatch(selectTableData('purchase'));
const sessionId = cookies.get('session-id');

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     sessionId,
  //     online: false,
  //     user: null,
  //   };

  //   this.socket = createSocket(store.dispatch);
  //   this.api = {
  //     placeOrder: (...args) => this.socket.rpc('placeOrder', args),
  //     updateOrder: (...args) => this.socket.rpc('updateOrder', args),
  //     sum: (...args) => this.socket.rpc('sum', args),
  //   };

  //   this.socket.on('connect', () => {
  //     console.log('Conneted');
  //     this.setState({
  //       online: true,
  //     });
  //   });
  //   this.socket.on('disconnect', () => {
  //     console.log('disconnected');
  //     this.setState({
  //       online: false,
  //     });
  //   });

  //   this.socket.on('error', (e) => {
  //     console.error(e);
  //   });

  //   this.socket.on('event', (name, data) => {
  //     if (name === 'user') {
  //       this.setState({
  //         user:data,
  //       });
  //     }
  //   });

  //   if (sessionId) {
  //     this.socket.open(`ws://localhost:8080/${sessionId}`);
  //   }
  // }

  // getChildContext() {
  //   return {
  //     api: this.api,
  //   };
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.state.sessionId !== nextState.sessionId) {
  //     console.log('connected');
  //     this.socket.open(`ws://localhost:8080/${nextState.sessionId}`);
  //   }
  //   return true;
  // }
>>>>>>> bhagya/master

  render() {
    const { sessionId, user, online } = this.state;
    if (sessionId === null) {
      return <Login onLogin={(u) => { this.setState({ sessionId: u.token }); }} />;
    } else if (user !== null) {
      if (user.role === 'cashier') {
        return <Cashier />;
      } else if (user.role === 'admin') {
        return <Admin />
      } else {
        return <Error />
      }
    } else {
      return <Loading />;
    }

    return (
      <div>
        <Provider store={store}>
          <MainApp />
        </Provider>
      </div>
    );
  }
}
<<<<<<< HEAD

App.childContextTypes = {
  api: PropTypes.object,
};

=======
// App.childContextTypes = {
//   api: PropTypes.object,
// };
>>>>>>> bhagya/master
export default App;
