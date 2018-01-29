import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import PropTypes from 'prop-types';
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import login from '../actions/login';


class AdminLogin extends Component {
  constructor(props) {
    super(props);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.state = {
      username: '',
      password: '',
    };
  }

  inputChangeHandler(field) {
    return (e) => {
      console.log(e.target.value);
      this.setState({
        [field]: e.target.value,
      });
    };
  }

  render() {
    const { username, password } = this.state;
    return (
      <div className="wrapper">
        <div className="admin-section-wrapper">
          <div className="login-form">
            <Grid
              textAlign="center"
              style={{ height: '100%' }}
              verticalAlign="middle"
            >
              <Grid.Column style={{ maxWidth: 450 }}>
                <Form size="large">
                  <Segment stacked>
                    <Header as="h1" color="teal">Enter your login details</Header>
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
                      onClick={() => this.props.dispatch(login(this.state.username, this.state.password))} >
                      Login
                    </Button>
                  </Segment>
                </Form>
                {this.props.error === 'Invalid username/password' ?
                  <Message
                    error
                    content="Invalid Username and Password."
                  /> : ''}
              </Grid.Column>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

AdminLogin.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
};
export default connect()(AdminLogin);