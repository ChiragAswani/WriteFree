import React from 'react';
import { Button, Cascader} from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import { CirclePicker } from 'react-color';
import request from 'request';
import {getNotesByEmail} from "../constants";


class DefaultSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noteColor: this.props.history.location.state.credentials.defaultNoteSettings.noteColor,
            defaultfontName: [this.props.history.location.state.credentials.defaultNoteSettings.fontName],
            defaultfontSize: [this.props.history.location.state.credentials.defaultNoteSettings.fontSize]
        }
    }

    filter(inputValue, path) {
        return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    }

    changeNoteColor = (color) => {
        this.setState({ noteColor: color.hex });
    };

    saveDefaultSettings(noteColor, fontName, fontSize){
        const obj = {_id: this.props.location.state.credentials._id, noteColor, fontName, fontSize}
        if (!obj.noteColor){obj.noteColor = "#8bc34a"}
        if (!obj.fontName){obj.fontName = "Georgia"}
        if (!obj.fontSize){obj.fontSize = 11}
        var updateDefaultSettings = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/update-default-settings',
            body: JSON.stringify(obj),
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(updateDefaultSettings, function (error, response, body) {
            this.goToDashBoard(this.props.location.state.credentials.email)
        }.bind(this));
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

    fontName = [{
        value: 'Arial',
        label: 'Arial',
    }, {
        value: 'Georgia',
        label: 'Georgia',
    }, {
        value: 'Impact',
        label: 'Impact',
    }, {
        value: 'Tahoma',
        label: 'Tahoma',
    }, {
        value: 'Times New Roman',
        label: 'Times New Roman',
    }, {
        value: 'Verdana',
        label: 'Verdana'
    }];

    fontSize = [{
        value: 8,
        label: 8,
    }, {
        value: 9,
        label: 9,
    }, {
        value: 10,
        label: 10,
    }, {
        value: 11,
        label: 11,
    }, {
        value: 12,
        label: 12,
    }, {
        value: 14,
        label: 14
    }];

    render() {
        return (
            <div>
                <br/>
                <p>Note Color</p>
                <CirclePicker
                    color={ this.state.noteColor }
                    onChangeComplete={ this.changeNoteColor }
                />
                <p>Font Name</p>
                <Cascader
                    options={this.fontName}
                    onChange={(fontName) => this.setState({fontName: fontName[0]})}
                    defaultValue={this.state.defaultfontName}
                    placeholder="Please select"
                    showSearch={this.filter}
                />
                <p>Font Size</p>
                <Cascader
                    options={this.fontSize}
                    onChange={(fontSize) => this.setState({fontSize: fontSize[0]})}
                    defaultValue={this.state.defaultfontSize}
                    placeholder="Please select"
                    showSearch={this.filter}
                />
                <br/>
                <a onClick={() => this.saveDefaultSettings("#8bc34a", "Georgia", 11)}> Or Use Reccomended Settings</a><br/>
                <Button onClick={() => this.saveDefaultSettings(this.state.noteColor, this.state.fontName, this.state.fontSize)}>Save Default Settings</Button>
                <br/>
            </div>
        )
    }
}

export default withRouter(DefaultSettings);
