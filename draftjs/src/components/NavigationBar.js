/* eslint-disable */
import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import '../css/navigation-bar.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Dropdown, Menu} from "antd";
import {backendURL} from "../dependency";

class NavigationBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            menu: (
                <Menu>
                    <Menu.Item>
                        <a onClick={() => this.logout()}>Log Out</a>
                    </Menu.Item>
                    <Menu.Item>
                        <a onClick={() => this.goToDashBoard()}>Dashboard</a>
                    </Menu.Item>
                </Menu>
            )
        };
    }

    goToDashBoard(){
        this.props.history.push('/dashboard')
    }

    logout() {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const AuthStr = 'Bearer '.concat(accessToken);
        const AuthStr2 = 'Bearer '.concat(refreshToken);
        const headers = { Authorization: AuthStr };
        axios.get(`${backendURL}/logout`, { headers });
        axios.get(`${backendURL}/logout2`, { headers: { Authorization: AuthStr2 } }).then((response) => {
            localStorage.clear();
            this.props.history.push('/login');
        });
    }

    render() {
        return (
            <div className={"top"}>
                <img onClick={() => this.goToDashBoard()} src="https://github.com/ChiragAswani/Husky-Test/blob/master/logo.png?raw=true" height="20px"/>
                <Dropdown overlay={this.state.menu}>
                    <FontAwesomeIcon icon="user"/>
                </Dropdown>
            </div>
        );
    }
}


export default withRouter(NavigationBar);
