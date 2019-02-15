/* eslint-disable */
import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import 'antd/dist/antd.css';
import '../css/navigation-bar.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Dropdown, Menu, Modal, Button} from "antd";
import {backendURL} from "../dependency";
import { ReactTypeformEmbed } from 'react-typeform-embed';

class NavigationBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
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



    showSubmitFeedbackModal = () => {
        this.setState({
          visible: true,
        });
      }

    showFeedbackModal = () => {
        const feedback = axios.get(
                                    `https://api.typeform.com/forms/HBVMMC/responses`, 
                                    { headers: {Authorization: `Bearer EDGtnwFmvGATtjiQ2EXL4Jh3ZCcE1xFmKkPb6kATMP5S`}});
        console.log(feedback);
        this.setState({
          visible: true,
        });
      }

      handleOk = (e) => {
        console.log(e);
        this.setState({
          visible: false,
        });
      }

      handleCancel = (e) => {
        console.log(e);
        this.setState({
          visible: false,
        });
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
                <Button type="primary" onClick={this.showSubmitFeedbackModal}>
                  Submit Feedback
                </Button>
                <Modal
                  title="Submit Feedback"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                >
                  <ReactTypeformEmbed url="https://ioe.typeform.com/to/HBVMMC" />
                </Modal>
                <Dropdown overlay={this.state.menu}>
                    <FontAwesomeIcon icon="user"/>
                </Dropdown>
            </div>
        );
    }
}


export default withRouter(NavigationBar);
