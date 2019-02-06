/* eslint-disable */
import React from 'react';
import request from 'request';
import { Input, Button, Card } from 'antd';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import GoogleButton from 'react-google-button';
import Alert from 'react-s-alert';
import '../css/create-account.css';
import { handleAccountError } from '../defaults/constants';
import book from '../images/book_landing.png';
import LandingNavigation from './LandingNavigation';

class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      fullName: "",
      password: "",
    };
  }
  createAccount(email, fullName, password) {
      if (!email.trim() || !fullName.trim() || !password.trim()){
          return handleAccountError("Missing Information");
      }
    const postCreateAnAccountInformation = {
      method: 'POST',
      url: 'http://127.0.0.1:5000/create-account',
      qs: { email, fullName, password },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    request(postCreateAnAccountInformation, (error, response, body) => {
        let err = "";
        if (response.statusCode === 501) {
            err = "Invalid email address"
            handleAccountError(err);
        } else if (response.statusCode === 502) {
            err = "Invalid name entered"
            handleAccountError(err);
        } else if (response.statusCode === 503) {
            err = "Password must be at least 8 characters long and contain 1 special character"
            handleAccountError(err);
        }
        else {
            console.log(body)
            const parsedData = JSON.parse(body);
            localStorage.setItem('email', email);
            localStorage.setItem('access_token', parsedData.access_token);
            localStorage.setItem('id', parsedData.access_token);
            localStorage.setItem('refresh_token', parsedData.refresh_token);
            this.props.history.push('/default-settings');
        }
    });
  }

  googleSignUp(response) {
    const email = response.profileObj.email;
    const googleID = (response.profileObj.googleId).toString();
    const name = (response.profileObj.name).toString();
    const postLoginInformation = {
      method: 'POST',
      url: 'http://127.0.0.1:5000/create-account-google',
      qs: { email, google_id: googleID, name },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    request(postLoginInformation, (error, res, body) => {
      if (res.statusCode === 401) {
        /* TODO in backend:
           -is email valid
           -is email duplicate
           -is fullName valid
           -is password valid
         */
        handleAccountError(error);
      } else {
        const parsedData = JSON.parse(body);
        localStorage.setItem('email', email);
        localStorage.setItem('access_token', parsedData.access_token);
        localStorage.setItem('id', parsedData.access_token);
        localStorage.setItem('refresh_token', parsedData.refresh_token);
        this.props.history.push('/default-settings');
      }
    });
  }

  render() {
    document.body.style.backgroundColor = "#f5f5f5"
    return (
      <div>
      <LandingNavigation/>
        <Alert timeout={3000} />
        <div className={"create-account-container"} style ={ { backgroundImage: "url("+book+")" }}>
          <div className={"create-account"}>
            <Card
          title="Create An Account"
          style={{ "width": "400px", "background":"none", "border":"0px solid black"}}
        >
          <Input style={{"margin":"10px auto"}} placeholder="Email" onChange={email => this.setState({ email: email.target.value })} /> <br />
          <Input style={{"margin":"10px auto"}} placeholder="Full Name" onChange={fullName => this.setState({ fullName: fullName.target.value })} /> <br />
          <Input style={{"margin":"10px auto"}} placeholder="Password" type="password" onChange={password => this.setState({ password: password.target.value })} /> <br />
          <Button type="primary" onClick={() => this.createAccount(this.state.email, this.state.fullName, this.state.password)}>Sign Up</Button><br />
          <Card style={{"background":"none", "border":"0px solid black"}}>
            <p>Have an account? <a onClick={() => this.props.history.push("/login")}> Login </a> </p>
          </Card>
          <GoogleLogin
            clientId="402919311024-18n9b01dptgeg774297fp4u9ir18sb6g.apps.googleusercontent.com"
            onSuccess={succ => this.googleSignUp(succ)}
            onFailure={fail => this.googleSignUp(fail)}
            style={{
                border: 'none',
                background: 'none',
                padding: 0,
                margin: 0,
            }}
          >
            <GoogleButton label="Sign up With Google" />
          </GoogleLogin>
        </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CreateAccount);
