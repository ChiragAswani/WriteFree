import React from 'react';
import request from 'request';
import { Input, Button, Card } from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import Cookies from 'universal-cookie';
import { GoogleLogin } from 'react-google-login';
import GoogleButton from 'react-google-button'

//import createHistory from "history/createBrowserHistory";

//const history = createHistory()

class CreateAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            fullName: null,
            password: null,
            errors: []
        };
    }
    validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    createAnAccount(email, fullName, password) {
        if (!this.validateEmail(email)){
           this.setState({errors: "Please enter a valid email"})
        } else {
            var postCreateAnAccountInformation = {
                method: 'POST',
                url: 'http://127.0.0.1:5000/create-account',
                qs: { email, fullName, password },
                headers: {'Content-Type': 'application/x-www-form-urlencoded' }
            };
            request(postCreateAnAccountInformation, function (error, response, body) {
                if (error) throw new Error(error);
                if (response.statusCode === 401){
                    this.setState({errors: body})
                } else {
                    const parsedBody = JSON.parse(body)

                    var ident = parsedBody.credentials._id


                    const cookies = new Cookies();
                    cookies.set('email', email, { path: '/', maxAge: 1800 });
                    const parsedData = JSON.parse(body)
                    cookies.set('id',ident,{ path: '/', maxAge: 1800 });

                    this.props.history.push({
                        pathname: "/dashboard",
                        state: {notes: parsedBody.notes, credentials: parsedBody.credentials}
                    });
                }
            }.bind(this));
        }
    }

    render() {
        //console.log("STATE", this.state)
        //console.log("HISTORY", this.props.location.state)

        this.responseGoogle = (response) => {
            var email = response.profileObj.email;
            var google_id = (response.profileObj.googleId).toString();
            var name = (response.profileObj.name).toString();
            console.log(google_id);

            var postLoginInformation = {
                method: 'POST',
                url: 'http://127.0.0.1:5000/create-account_google',
                qs:{email, google_id, name},
                headers: {'Content-Type': 'application/x-www-form-urlencoded' }
            };
            request(postLoginInformation, function (error, response, body) {
                if (error) throw new Error(error);
                if (response.statusCode === 401){
                    this.setState({errors: body})
                } else {
                    console.log(JSON.parse(body))
                    const parsedData = JSON.parse(body);
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
                    title="Create An Account"
                    style={{ width: 400 }}
                >
                <Input placeholder="Email" onChange={email => this.setState({email: email.target.value})}/> <br/>
                <Input placeholder="Full Name" onChange={fullName => this.setState({fullName: fullName.target.value})}/> <br/>
                <Input placeholder="Password" type="password" onChange={password => this.setState({password: password.target.value})}/> <br/>
                <Button type="primary" onClick={() => this.createAnAccount(this.state.email, this.state.fullName, this.state.password)}>Sign Up</Button><br/>
                    {this.state.errors}
                    <Card>
                        <p>Have an account? <a onClick={() => this.props.history.push("/login")}> Login </a> </p>
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
                        <GoogleButton
                            label= "Sign up With Google"/>
                    </GoogleLogin>
                </Card>
            </div>
        )
    }
}

export default withRouter(CreateAccount);
