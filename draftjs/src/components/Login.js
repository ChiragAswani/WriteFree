import React from 'react';
import { withRouter } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import GoogleButton from 'react-google-button';
import axios from 'axios';
import { Input, Button, Card } from 'antd';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import Alert from 'react-s-alert';
import { handleAccountError } from '../constants';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
    };
  }

  login(email, password) {
    axios.get(
      'http://127.0.0.1:5000/login', { params: { email, password } },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    ).then((res) => {
      const parsedData = res.data;
      localStorage.setItem('email', email);
      localStorage.setItem('access_token', parsedData.access_token);
      localStorage.setItem('id', parsedData.access_token);
      localStorage.setItem('refresh_token', parsedData.refresh_token);
      return this.props.history.push('/dashboard');
    }).catch((error) => {
      handleAccountError(error.response.data);
    });
  }
  googleLogin(response) {
    const email = response.profileObj.email;
    const googleID = response.profileObj.googleId;
    axios.get(
      'http://127.0.0.1:5000/login-google', { params: { email, googleID } },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    ).then((res) => {
      const parsedData = res.data;
      localStorage.setItem('email', email);
      localStorage.setItem('access_token', parsedData.access_token);
      localStorage.setItem('id', parsedData.access_token);
      localStorage.setItem('refresh_token', parsedData.refresh_token);
      this.props.history.push('/dashboard');
    }).catch((error) => {
      handleAccountError(error.response.data);
    });
  }

  render() {
    return (
      <div>
        <Alert timeout={3000} />
        <Card
          title="Login"
          style={{ width: 400 }}
        >
          <Input placeholder="Email" onChange={email => this.setState({ email: email.target.value })} /> <br />
          <Input placeholder="Password" type="password" onChange={password => this.setState({ password: password.target.value })} /> <br />
          <Button type="primary" onClick={() => this.login(this.state.email, this.state.password)}>Login</Button>
          <Card>
            <p>Dont have an account? <a onClick={() => this.props.history.push("/create-account")}> Sign Up </a> </p>
          </Card>
          <GoogleLogin
            clientId="402919311024-18n9b01dptgeg774297fp4u9ir18sb6g.apps.googleusercontent.com"
            onSuccess={succ => this.googleLogin(succ)}
            onFailure={fail => this.googleLogin(fail)}
            style={{
                border: 'none',
                background: 'none',
                padding: 0,
                margin: 0,
            }}
          >
            <GoogleButton />
          </GoogleLogin>
        </Card>
      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Login);
