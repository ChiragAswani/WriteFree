import React from 'react';
import request from 'request';
import { Input, Button, Card } from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";

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
    validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    login(email, password) {
        if (!this.validateEmail(email)) {
            this.setState({errors: "Please enter a valid email"})
        } else {
            var postLoginInformation = {
                method: 'GET',
                url: 'http://127.0.0.1:5000/login',
                qs: {email, password},
                credentials: 'same-origin',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            };
            request(postLoginInformation, function (error, response, body) {
                if (error) throw new Error(error);
                if (response.statusCode === 401) {
                    this.setState({errors: body})
                } else {
                    sessionStorage.clear();
                    let key = 'email'
                    sessionStorage.setItem(key, email)
                    const parsedData = (JSON.parse(body))
                    this.props.history.push({
                        pathname: "/dashboard",
                        state: {userData: parsedData.noteData, credentials: parsedData.credentials}
                    });
                }
            }.bind(this));
        }
    }
    render() {
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
                </Card>
            </div>
        )
    }
}

export default withRouter(Login);
