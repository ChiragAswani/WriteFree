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
                sessionStorage.clear();
                let key = 'email'
                sessionStorage.setItem(key, email)

                const parsedData = JSON.parse(body)
                console.log("PARSED DATA", parsedData)
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
        return (
            <div>

                <Card
                    title="Login"
                    style={{ width: 400 }}
                >
                    <Input placeholder="Email" onChange={email => this.setState({email: email.target.value, errors: []})}/> <br/>
                    <Input placeholder="Password" onChange={password => this.setState({password: password.target.value, errors: []})}/> <br/>
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
