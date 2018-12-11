import React from 'react';
import { withRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import '../css/login.css';

class Error404 extends React.Component {

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
