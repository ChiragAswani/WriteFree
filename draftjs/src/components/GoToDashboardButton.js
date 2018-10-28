import React from 'react';
import { Button, Cascader} from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import { CirclePicker, SketchPicker, BlockPicker } from 'react-color';
import request from 'request';

class GoToDashboardButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    goToDashBoard(email){
        var getNotes = {
            method: 'GET',
            url: 'http://127.0.0.1:5000/get-notes',
            qs:{email},
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(getNotes, function (error, response, body) {
            if (error) throw new Error(error);
            if (response.statusCode === 401){
                this.setState({errors: body})
            } else {
                const parsedData = JSON.parse(body)
                this.props.history.push({
                    pathname: "/dashboard",
                    state: {
                        credentials: this.props.location.state.credentials,
                        notes: parsedData.notes
                    }
                })
            }
        }.bind(this));
    }


    render() {
        //console.log("STATE", this.state)
        //console.log("HISTORY", this.props.location.state)
        return (
            <Button type="primary" onClick={() => this.goToDashBoard(this.props.location.state.credentials.email)}>Go To Dashboard</Button>
        )
    }
}

export default withRouter(GoToDashboardButton);
