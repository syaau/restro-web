import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.state = {
      username: '',
      password: '',
      error: '',
    };
  }

  inputChangeHandler(field) {
    return (e) => {
      this.setState({
        [field]: e.target.value,
      });
    };
  }

  handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios({
        method: 'post',
        data: {
          username: this.state.username,
          password: this.state.password,
        },
        url: '/login',
      });

      console.log(response.status, typeof response.status);
      if (response.status === 200) {
        this.props.onLogin(response.data);
      } else {
        this.setState({
          error: 'Invalid username/password',
        });
      }
    } catch (err) {
      console.error(err);
      this.setState({
        error: 'Invalid username/password',
      });
    }
  }

  render() {
    const { username, password } = this.state;
    return (
      <Grid.Row centered>
        <Grid.Column width={8}>
          <Segment>
            <Form size="large" onSubmit={this.handleLogin}>
              <Header as="h1" color="teal">Enter your login details</Header>
              {this.state.error &&
                <Message
                  error
                  content={this.state.error}
                />}
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="User Name...."
                value={username}
                onChange={this.inputChangeHandler('username')}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={password}
                onChange={this.inputChangeHandler('password')}
              />
              <Button
                fluid
                color="teal"
                size="large"
              >
                Login
              </Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
