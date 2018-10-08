import React from 'react';
import axios from 'axios';
import { Form, Icon, Input, Button, Checkbox } from 'antd';

const FormItem = Form.Item;

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            fullName: null,
            password: null
        }
    }
    createOrLoginAccount(email, fullName, password) {
        const header = {headers: {"Access-Control-Allow-Origin": "*", "Content-Type": "application/json"}};
        axios.post('http://127.0.0.1:5000/create-account', {email, fullName, password}, header).then(value =>{
            console.log(value)
        })
    }

    render() {
        return (
            <div>
                <Input placeholder="Email" onChange={email => this.setState({email: email.target.value})}/>
                <Input placeholder="Full Name" onChange={fullName => this.setState({fullName: fullName.target.value})}/>
                <Input placeholder="Password" onChange={password => this.setState({password: password.target.value})}/>
                <Button type="primary" onClick={() => this.createOrLoginAccount(this.state.email, this.state.fullName, this.state.password)}>Create An Account/Login (For POC)</Button>
            </div>
        )
    }
}

export default LoginPage;
