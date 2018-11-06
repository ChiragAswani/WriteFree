import React from 'react';
import request from 'request';
import { Input, Button, Card } from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import Cookies from 'universal-cookie';
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
        }
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


                    const cookies = new Cookies();
                    cookies.set('email', email, { path: '/', maxAge: 1800 });


                    const parsedData = JSON.parse(body)
                    cookies.set('password',password,{ path: '/', maxAge: 1800 });

                    const parsedBody = JSON.parse(body)

                    this.props.history.push({
                        pathname: "/dashboard",
                        state: {userData: [], credentials: (JSON.parse(body))}
                    });
                }
            }.bind(this));
        }
    }
    render() {
        return (
            <div>
                <Card
                    title="Create An Account"
                    style={{ width: 400 }}
                >
                <Input placeholder="Email" onChange={email => this.setState({email: email.target.value})}/> <br/>
                <Input placeholder="Full Name" onChange={fullName => this.setState({fullName: fullName.target.value})}/> <br/>
                <Input placeholder="Password" onChange={password => this.setState({password: password.target.value})}/> <br/>
                <Button type="primary" onClick={() => this.createAnAccount(this.state.email, this.state.fullName, this.state.password)}>Sign Up</Button><br/>
                    {this.state.errors}
                    <Card>
                        <p>Have an account? <a onClick={() => this.props.history.push("/login")}> Login </a> </p>
                    </Card>
                </Card>
            </div>
        )
    }
}

export default withRouter(CreateAccount);
