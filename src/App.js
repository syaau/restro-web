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
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

App.childContextTypes = {
  api: PropTypes.object,
};

export default App;
