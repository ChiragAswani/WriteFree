import React from 'react';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom';
import { CirclePicker } from 'react-color';
import request from 'request';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import axios from "axios";

class DefaultSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noteColor: '#8bc34a',
    };
  }

  componentDidMount() {

      const accessToken = localStorage.getItem('access_token');
      const AuthStr = `Bearer `.concat(accessToken);
      const headers = { Authorization: AuthStr };
      axios.get('http://127.0.0.1:5000/get-default-settings', {headers: headers}).then((response) => {
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

  async saveDefaultSettings(noteColor, fontName, fontSize) {
    const obj = {
      email: noteColor, fontName, fontSize,
    };
    if (!obj.noteColor) { obj.noteColor = '#8bc34a'; }
    if (!obj.fontName) { obj.fontName = 'Georgia'; }
    if (!obj.fontSize) { obj.fontSize = 11; }

    const accessToken = localStorage.getItem('access_token');
    const AuthStr = `Bearer `.concat(accessToken);
    const headers = { Authorization: AuthStr };
    const body = JSON.stringify(obj);
    axios.post('http://127.0.0.1:5000/update-default-settings', { body: body  }, {headers: headers},).then((response) => {
      if(response.status==200){
        this.props.history.push('/dashboard');
      }
      console.log("ERROR WITH JWT");

    });
    // const updateDefaultSettings = {
    //   method: 'POST',
    //   url: 'http://127.0.0.1:5000/update-default-settings',
    //   body: JSON.stringify(obj),
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    // };
    // await request(updateDefaultSettings);
    // this.props.history.push('/dashboard');
  }

  render() {
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
        <a onClick={() => this.saveDefaultSettings('#8bc34a', 'Georgia', 11)}> Or Use Reccomended Settings</a><br/>
        <Button onClick={() => this.saveDefaultSettings(this.state.noteColor, this.state.fontName, this.state.fontSize)}>Save Default Settings</Button>
        <br />
      </div>
    );
  }
}

export default withRouter(DefaultSettings);
