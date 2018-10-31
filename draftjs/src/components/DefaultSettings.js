import React from 'react';
import { Button, Cascader} from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import { CirclePicker } from 'react-color';
import GoToDashboardButton from './GoToDashboardButton';
import request from 'request';


class DefaultSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noteColor: '',
            applicationColor: ''
        }
    }

    goToDashBoard(){
        this.props.history.push({
            pathname: "/dashboard",
            state: {
                credentials: this.props.location.state.credentials,
                notes: this.props.location.state.notes
            }
        })
    }
    onChange(value, selectedOptions) {
        //console.log(value, selectedOptions);
    }

    filter(inputValue, path) {
        return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    }

    changeNoteColor = (color) => {
        this.setState({ noteColor: color.hex });
    };
    changeApplicationColor = (color) => {
        this.setState({ applicationColor: color.hex });
    };

    saveDefaultSettings(noteColor, applicationColor, font){
        const obj = {email: this.props.location.state.credentials.email, noteColor, applicationColor, font: font}
        var postNewNote = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/update-default-settings',
            body: JSON.stringify(obj),
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(postNewNote, function (error, response, body) {
            if (error) throw new Error(error);
            if (response.statusCode === 401){
                this.setState({errors: body})
            } else {

                // this.props.history.push({
                //     pathname: "/new-note",
                //     state: {
                //         credentials: this.props.location.state.credentials,
                //         userData: this.props.location.state.userData,
                //         noteData: JSON.parse(body)
                //     }
                // })
            }
        }.bind(this));
    }

    render() {
        const options = [{
            value: 'zhejiang',
            label: 'Zhejiang',
            children: [{
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [{
                    value: 'xihu',
                    label: 'West Lake',
                }, {
                    value: 'xiasha',
                    label: 'Xia Sha',
                    disabled: true,
                }],
            }],
        }, {
            value: 'jiangsu',
            label: 'Jiangsu',
            children: [{
                value: 'nanjing',
                label: 'Nanjing',
                children: [{
                    value: 'zhonghuamen',
                    label: 'Zhong Hua men',
                }],
            }],
        }];
        //console.log("STATE", this.state)
        //console.log("HISTORY", this.props.location.state)
        return (
            <div>
                <br/>
                <p>Note Color</p>
                <CirclePicker
                    color={ this.state.noteColor }
                    onChangeComplete={ this.changeNoteColor }
                />
                <p>Application Color</p>
                <CirclePicker
                    color={ this.state.applicationColor }
                    onChangeComplete={ this.changeApplicationColor }
                />

                <p>Font</p>
                <Cascader
                    options={options}
                    onChange={this.onChange}
                    placeholder="Please select"
                    showSearch={this.filter}
                />
                <br/>
                <Button onClick={() => this.saveDefaultSettings(this.state.noteColor, this.state.applicationColor, "helvetica")}>Save Default Settings</Button>
                <br/>
                <GoToDashboardButton/>
            </div>
        )
    }
}

export default withRouter(DefaultSettings);
