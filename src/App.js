/* global window */
import React, { Component } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Container, Dimmer, Header, Icon, Grid } from 'semantic-ui-react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import Cookies from 'universal-cookie';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import createSocket, { connectApi, XHRValidator, ValidationError } from 'socket.red-client';

import { WEBSOCKET_URL } from './config';
import Api from './Api';
import Login from './components/Login';
import Cashier from './screens/Cashier';
import Admin from './screens/Admin';
import Report from './screens/Report';

import schemaReducer from './reducers/schemaReducer';

import './App.css';

const cookies = new Cookies();

const store = createStore(combineReducers({
  schema: schemaReducer('User', 'ItemType', 'Item', 'MenuItem', 'Order', 'OrderItem', 'Table'),
}), applyMiddleware(thunk));

function getUserScreen(role) {
  switch (role) {
    case 'Waiter':
    case 'Cashier':
      return Cashier;

    case 'Admin':
      return Admin;

    default:
      return null;
  }
}

const SESSION_KEY = 'session-id';

class App extends Component {
  constructor(props) {
    super(props);

    const sessionId = cookies.get(SESSION_KEY);

    this.state = {
      user: null,
      offline: true,
      sessionId,
    };

    // Use session id to open websocket connection
    // this.state.sessionId = session && session.token;

    // Create socket with default options
    this.socket = createSocket(store.dispatch, {
      erroRetryInterval: 1000,
      responseTimeoutInterval: 15000,
    }, undefined, undefined, XHRValidator);

    this.api = connectApi(Api, this.socket);

    this.socket.on('error', (e) => {
      // eslint-disable-next-line no-console
      console.error('Socket error', e);

      // TODO: ValidationError checking is not working here
      if (e instanceof ValidationError) {
        this.setState({
          user: null,
        });
      }
    });

    this.socket.on('connect', (user) => {
      this.setState({
        user,
        offline: false,
      });
    });

    this.socket.on('disconnect', () => {
      this.setState({
        offline: true,
      });
    });
  }

  componentDidMount() {
    if (this.state.sessionId) {
      this.socket.open(`${WEBSOCKET_URL}${this.state.sessionId}`);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.sessionId !== this.state.sessionId && this.state.sessionId) {
      this.socket.open(`${WEBSOCKET_URL}${this.state.sessionId}`);
    }
  }

  onLogin = (user) => {
    this.setState({
      user,
      sessionId: user.token,
    });

    cookies.set(SESSION_KEY, user.token);
  }

  onLogout = () => {
    cookies.set(SESSION_KEY, null);

    this.setState({
      user: null,
      sessionId: null,
    });

    this.socket.close();
  }

  render() {
    const { user, offline } = this.state;

    let content = null;
    const dimmer = user && offline;
    if (!user) {
      content = <Login onLogin={this.onLogin} />;
    } else if (window.location.hash === '#report') {
      content = <Report user={user} onLogout={this.onLogout} api={this.api} />;
    } else {
      const Screen = getUserScreen(user.role);
      content = <Screen user={user} onLogout={this.onLogout} api={this.api} />;
    }

    return (
      <Container>
        <Grid>
          <Dimmer.Dimmable dimmed={dimmer}>
            <Container>
              <Dimmer active={dimmer}>
                <Header as="h2" icon inverted>
                  <Icon name="globe" />
                  No Connection
                </Header>
              </Dimmer>
              <Provider store={store}>
                <div className="wrapper">
                  {content}
                </div>
              </Provider>
            </Container>
          </Dimmer.Dimmable>
        </Grid>
      </Container>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
