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

class Error404 extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        document.body.style.backgroundColor = "#f5f5f5"
        return (
            <div>
                <p>Error 404</p>
            </div>
        );
    }
}

export default withRouter(Error404);
