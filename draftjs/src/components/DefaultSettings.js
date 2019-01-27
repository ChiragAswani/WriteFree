/* eslint-disable */
import React from 'react';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom';
import { CirclePicker } from 'react-color';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import axios from "axios";
import {backendURL} from "../dependency";

class DefaultSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noteColor: '#f0E5EB',
    };
  }

  componentDidMount() {
      if (!localStorage.getItem('id')){
          return this.props.history.push('/login')
      }
      const accessToken = localStorage.getItem('access_token');
      const AuthStr = `Bearer `.concat(accessToken);
      const headers = { Authorization: AuthStr };
      axios.get(`${backendURL}/get-default-settings`, {headers: headers}).then((response) => {
          console.log(response)
          const parsedData =response.data;
          let val = '';
          try {
              val = parsedData.credentials.defaultNoteSettings.fontSize.toString();
          } catch (err) {
              val = '12';
          }
          this.setState({
              noteColor: parsedData.credentials.defaultNoteSettings.noteColor,
              fontName: parsedData.credentials.defaultNoteSettings.fontName,
              fontSize: val,
              fontNames: parsedData.applicationSettings.fontNames,
              fontSizes: parsedData.applicationSettings.fontSizes,
          });

      });


  }

  changeNoteColor(color) {
    this.setState({ noteColor: color.hex });
  }

  saveDefaultSettings(noteColor, fontName, fontSize) {
    const obj = {
      noteColor, fontName, fontSize,
    };
    if (!obj.noteColor) { obj.noteColor = '#f0E5EB'; }
    if (!obj.fontName) { obj.fontName = 'Georgia'; }
    if (!obj.fontSize) { obj.fontSize = 11; }

    const accessToken = localStorage.getItem('access_token');
    const AuthStr = `Bearer `.concat(accessToken);
    const headers = { Authorization: AuthStr };
    const body = JSON.stringify(obj);
    console.log("UPDATING NOTE SETTINGS", obj)
    axios.post(`${backendURL}/update-default-settings`, { body: body  }, {headers: headers},).then((response) => {
      if(response.status === 200){
        this.props.history.push('/dashboard');
      }
      else {
          console.log("ERROR WITH JWT");
      }

    });
  }

    render() {
        document.body.style.backgroundColor = "#f5f5f5"
        console.log(this.state)
        return (
            <div>
                <br />
                <p>Note Color</p>
                <CirclePicker
                    color={this.state.noteColor}
                    onChangeComplete={color => this.changeNoteColor(color)}
                    colors={["#FCDFD7", "#FCF9DA", "#D4ECDC", "#E1EBF5", "#F0E5EB"]}
                />
                <p>Font Name</p>
                <Dropdown options={this.state.fontNames} onChange={fontName => this.setState({ fontName: fontName.value })} value={this.state.fontName} />
                <p>Font Size</p>
                <Dropdown options={this.state.fontSizes} onChange={fontSize => this.setState({ fontSize: fontSize.value.toString() })} value={this.state.fontSize} />
                <br />
                <a onClick={() => this.saveDefaultSettings('#F0E5EB', 'Georgia', 11)}> Or Use Recommended Settings</a><br/>
                <Button onClick={() => this.saveDefaultSettings(this.state.noteColor, this.state.fontName, this.state.fontSize)}>Save Default Settings</Button>
                <br />
            </div>
        );
    }
}

export default withRouter(DefaultSettings);
