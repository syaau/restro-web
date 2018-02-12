import React, { Component } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Container, Dimmer, Header, Icon, Grid } from 'semantic-ui-react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import Cookies from 'universal-cookie';
import createSocket, { connectApi } from 'socket.red-client';
import axios from 'axios';

import Api from './Api';
import Login from './components/Login';
import Cashier from './screens/Cashier';
import Admin from './screens/Admin';

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

    const session = cookies.get(SESSION_KEY);

    this.state = {
      user: null,
      offline: true,
      sessionId: -1,
    };

    // Use session id to open websocket connection
    // this.state.sessionId = session && session.token;

    // Create socket with default options
    this.socket = createSocket(store.dispatch, {
      erroRetryInterval: 500,
      responseTimeoutInterval: 200,
    });

    this.api = connectApi(Api, this.socket);

    this.socket.on('error', () => {
      this.validate(this.state.sessionId);
    });

    this.socket.on('connect', () => {
      this.setState({
        offline: false,
      });
    });

    this.socket.on('disconnect', () => {
      this.setState({
        offline: true,
      });
    });

    if (session) {
      this.validate(session.token);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.sessionId !== this.state.sessionId && this.state.sessionId) {
      this.socket.open(`ws://localhost:8080/${this.state.sessionId}`);
    }
  }

  onLogin = (user) => {
    this.setState({
      user,
      sessionId: user.token,
    });

    cookies.set(SESSION_KEY, user);
  }

  onLogout = () => {
    cookies.set(SESSION_KEY, null);

    this.setState({
      user: null,
      sessionId: null,
    });

    this.socket.close();
  }

  async validate(sessionId) {
    try {
      const response = await axios({
        url: `/validate/${sessionId}`,
        method: 'post',
      });
      this.setState({
        sessionId,
        user: response.data,
      });
    } catch (err) {
      this.setState({
        sessionId: null,
        user: null,
      });
    }
  }

  render() {
    const { user, offline, sessionId } = this.state;

    let content = null;
    const dimmer = !!(offline && sessionId);
    if (!sessionId) {
      content = <Login onLogin={this.onLogin} />;
    } else if (!user) {
      content = 'Loading...';
    } else {
      const Screen = getUserScreen(user.role);
      content = <Screen user={user} onLogout={this.onLogout} api={this.api} />;
    }

    return (
      <Container>
        <Grid stretched>
          <Dimmer.Dimmable dimmed={dimmer}>
            <Container>
              <Dimmer active={dimmer}>
                <Header as="h2" icon inverted>
                  <Icon name="globe" />
                  No Connection
                </Header>
              </Dimmer>
              <Provider store={store}>
                <div>
                  {content}
                  {/* Put a navigation bar here for userinformation, menu, logout, etc */}
                </div>
              </Provider>
            </Container>
          </Dimmer.Dimmable>
        </Grid>
      </Container>
    );
  }
}

export default App;
