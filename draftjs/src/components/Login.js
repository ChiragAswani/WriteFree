/* eslint-disable */
import React from 'react';
import { withRouter } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import GoogleButton from 'react-google-button';
import axios from 'axios';
import { Input, Button, Card } from 'antd';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import Alert from 'react-s-alert';
import { handleAccountError } from '../defaults/constants';
import '../css/login.css';
import features from '../images/features.png';
import book from '../images/book.png';

import {backendURL} from "../dependency";


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  login(email, password) {
      if (!email.trim() || !password.trim()){
          return handleAccountError("Invalid Email or Password");
      }
    axios.get(
        `${backendURL}/login`, { params: { email, password } },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    ).then((res) => {
      const parsedData = res.data;
      localStorage.setItem('email', email);
      localStorage.setItem('access_token', parsedData.access_token);
      localStorage.setItem('id', parsedData.access_token);
      localStorage.setItem('refresh_token', parsedData.refresh_token);
      return this.props.history.push('/dashboard');
    }).catch((error) => {
        try{
            handleAccountError(error.response.data);
        } catch {
            handleAccountError("We are having trouble connecting...");
        }

    });
  }
  googleLogin(response) {
    const email = response.profileObj.email;
    const googleID = response.profileObj.googleId;
    axios.get(
        `${backendURL}/login-google`, { params: { email, googleID } },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    ).then((res) => {
      const parsedData = res.data;
      localStorage.setItem('email', email);
      localStorage.setItem('access_token', parsedData.access_token);
      localStorage.setItem('id', parsedData.access_token);
      localStorage.setItem('refresh_token', parsedData.refresh_token);
      this.props.history.push('/dashboard');
    }).catch((error) => {
        try{
            handleAccountError(error.response.data);
        } catch {
            handleAccountError("We are having trouble connecting...");
        }
    });
  }

  render() {
    document.body.style.backgroundColor = "#f5f5f5"
    return (
      <div className={"login-center"} style ={ { backgroundImage: "url("+book+")" }}>
        <div className={"login-center-center"}>
            <p className={"sign-in"}>Sign In</p>
            <Alert timeout={3000} />

            <Input
                placeholder="Email"
                onChange={email => this.setState({ email: email.target.value })}
                className={"email-input"}
            />
            <br />
            <Input
                placeholder="Password"
                type="password"
                onChange={password => this.setState({ password: password.target.value })}
                className={"password-input"}
            />
            <br />
            <p className={"forgot-password"}>Forgot Password?</p>
            <Button type="primary" onClick={() => this.login(this.state.email, this.state.password)}>Sign In</Button>
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
        </div>

      </div>
    );
  }
}

Login.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Login);
