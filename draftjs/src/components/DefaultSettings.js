import React from 'react';
import { Button, Cascader} from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import { CirclePicker } from 'react-color';
import request from 'request';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

class DefaultSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            credentials: {defaultNoteSettings: {credentials: null}},
            noteColor: "#8bc34a",
            defaultfontName: "Georgia",
            defaultfontSize: 11
        }
    }

    changeNoteColor = (color) => {
        this.setState({ noteColor: color.hex });
    };

    saveDefaultSettings(noteColor, fontName, fontSize){
        const obj = {email: localStorage.getItem("email"), noteColor, fontName, fontSize}
        console.log(obj)
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
            this.props.history.push("/dashboard")
        }.bind(this));
    }

    fontName = ['Arial','Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana']
    fontSize = [8, 9, 10, 11, 12, 14]

    componentDidMount() {
        var getDefaultSettings = {
            method: 'GET',
            url: 'http://127.0.0.1:5000/get-default-settings',
            qs:{email: localStorage.getItem("email")},
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(getDefaultSettings, function (error, response, body) {
            const parsedData = JSON.parse(body)
            var val = "";
            try {
                val = parsedData.credentials.defaultNoteSettings.fontSize.toString()
            } catch {
                val = "12"
            }
            this.setState({
                credentials: parsedData.credentials,
                noteColor: parsedData.credentials.defaultNoteSettings.noteColor,
                fontName: parsedData.credentials.defaultNoteSettings.fontName,
                fontSize: val
            })
        }.bind(this));
    }

    render() {
        console.log("STATE", this.state)
        return (
            <div>
                <br/>
                <p>Note Color</p>
                <CirclePicker
                    color={this.state.noteColor}
                    onChangeComplete={ this.changeNoteColor }
                />
                <p>Font Name</p>
                <Dropdown options={this.fontName} onChange={(fontName) => this.setState({fontName})} value={this.state.fontName}/>
                <p>Font Size</p>
                <Dropdown options={this.fontSize} onChange={(fontSize) => this.setState({fontSize})} value={this.state.fontSize} />
                <br/>
                <a onClick={() => this.saveDefaultSettings("#8bc34a", "Georgia", 11)}> Or Use Reccomended Settings</a><br/>
                <Button onClick={() => this.saveDefaultSettings(this.state.noteColor, this.state.fontName.value, this.state.fontSize.value)}>Save Default Settings</Button>
                <br/>
            </div>
        )
    }
}

export default withRouter(DefaultSettings);
