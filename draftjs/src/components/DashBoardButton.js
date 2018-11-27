import React from 'react';
import { Button} from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";

class DashBoardButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Button type="primary" onClick={() => this.props.history.push("/dashboard")}>Go To Dashboard</Button>
        )
    }
}

export default withRouter(DashBoardButton);
