import React from 'react';
import request from 'request';
import { Input, Button, Card } from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import Cookies from 'universal-cookie';
import GoogleLogin from 'react-google-login';
import GoogleLoginButton from 'react-google-login-button'
import GoogleButton from "react-google-button";


//import createHistory from "history/createBrowserHistory";

//const history = createHistory()

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            errors: []
        }


    }
    login(email, password) {
        var postLoginInformation = {
            method: 'GET',
            url: 'http://127.0.0.1:5000/login',
            qs:{email, password },
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(postLoginInformation, function (error, response, body) {
            if (error) throw new Error(error);
            if (response.statusCode === 401){
                this.setState({errors: body})
            } else {
                const parsedData = JSON.parse(body)

                const cookies = new Cookies();
                cookies.set('email', email, { path: '/', maxAge: 1800 });
                cookies.set('id',parsedData.credentials._id,{path:'/', maxAge: 1800});

                this.props.history.push({
                    pathname: "/dashboard",
                    state: {notes: parsedData.notes, credentials: parsedData.credentials}
                });
            }
        }.bind(this));
    }




    render() {
        //console.log("STATE", this.state)
        //console.log("HISTORY", this.props.location.state)

        this.responseGoogle = (response) => {
            var email = response.profileObj.email
            var google_id = response.profileObj.googleId
            console.log(email)
            console.log(google_id)

            var postLoginInformation = {
                method: 'GET',
                url: 'http://127.0.0.1:5000/login_google',
                qs:{email, google_id},
                headers: {'Content-Type': 'application/x-www-form-urlencoded' }
            };
            request(postLoginInformation, function (error, response, body) {
                if (error) throw new Error(error);
                if (response.statusCode === 401){
                    this.setState({errors: body})
                } else {
                    const parsedData = JSON.parse(body)
                    console.log(parsedData);
                    const cookies = new Cookies();
                    cookies.set('email', email, { path: '/', maxAge: 1800 });
                    cookies.set('id',parsedData.credentials._id,{path:'/', maxAge: 1800});

                    this.props.history.push({
                        pathname: "/dashboard",
                        state: {notes: parsedData.notes, credentials: parsedData.credentials}
                    });
                }
            }.bind(this));
        }

        return (

            <div>

                <Card
                    title="Login"
                    style={{ width: 400 }}
                >
                    <Input placeholder="Email" onChange={email => this.setState({email: email.target.value, errors: []})}/> <br/>
                    <Input placeholder="Password" type="password" onChange={password => this.setState({password: password.target.value, errors: []})}/> <br/>
                    <Button type="primary" onClick={() => this.login(this.state.email, this.state.password)}>Login</Button>
                    {this.state.errors}
                    <Card>
                        <p>Don't have an account? <a onClick={() => this.props.history.push("/create-account")}> Sign Up </a> </p>
                    </Card>

                    <GoogleLogin
                        clientId="402919311024-18n9b01dptgeg774297fp4u9ir18sb6g.apps.googleusercontent.com"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        style={{
                            border: 'none',
                            background: 'none',
                            padding: 0,
                            margin: 0
                        }}
                    >
                        <GoogleButton/>
                    </GoogleLogin>
                </Card>
            </div>
        )
    }
}

export default withRouter(Login);
