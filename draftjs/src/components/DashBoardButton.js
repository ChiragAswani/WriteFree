import React from 'react';
import { Button} from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import {getNotesByEmail} from "../constants";

class DashBoardButton extends React.Component {
    constructor(props) {
        super(props);
    }

    async goToDashBoard(email){
        let userData = await getNotesByEmail(email)
        this.props.history.push({
            pathname: "/dashboard",
            state: {
                credentials: this.props.location.state.credentials,
                notes: userData.notes
            }
        })
    }

    render() {
        return (
            <Button type="primary" onClick={() => this.goToDashBoard(this.props.location.state.credentials.email)}>Go To Dashboard</Button>
        )
    }
}

export default withRouter(DashBoardButton);
