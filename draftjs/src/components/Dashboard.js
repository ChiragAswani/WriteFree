import React from 'react';
import { Table, Button, Switch, Input, Menu, Dropdown, Icon} from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import request from 'request';
import Walkthrough from './Walkthrough';
import axios from 'axios';
import '../css/dashboard.css';
import CardNote from "./CardNote";

const Search = Input.Search;

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notes : null,
            credentials: {runTutorial: null}
        }
    }
    noteColumns = [{
        title:"Document Name",
        dataIndex: "title",
    }, {
        title:"Date Created",
        dataIndex:"createdAt",
    }, {
        title:"Last Updated",
        dataIndex:"lastUpdated",
    },{
        title:"Category",
        dataIndex: "category",
    }, {
        title: 'Action',
        render: (text,record) =>
            <div>
                <a className={"editNote"} onClick={() => this.editNote(localStorage.getItem("email"), record._id)}>Edit | </a>
                <a className={"deleteNote"} onClick={() => this.deleteNote(localStorage.getItem("email"), record._id)}>Delete</a>
            </div>,
    }]

    editNote(email, noteID){
        var editNote = {
            method: 'GET',
            url: 'http://127.0.0.1:5000/fetch-note/'+ String(noteID),
            qs: { email, noteID },
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(editNote, function (error, response, body) {
            var parsedData = JSON.parse(body)
            this.props.history.push({
                pathname: "/note/"+noteID,
                state: {noteData: parsedData}
            });
        }.bind(this));
    }

    deleteNote(email, noteID){
        var deleteNote = {
            method: 'DELETE',
            url: 'http://127.0.0.1:5000/delete-note',
            qs: { email, noteID },
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(deleteNote, function (error, response, body) {
            const parsedData = JSON.parse(body);
            this.setState({notes : parsedData.notes})
        }.bind(this));
    }


    createNote(credentials){
        var postNewNote = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/new-note',
            qs: { email: localStorage.getItem("email") },
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(postNewNote, function (error, response, body) {
            var parsedData = JSON.parse(body);
            this.props.history.push({
                pathname: "/new-note/" + parsedData["_id"],
                state: {noteData: parsedData}
            })
        }.bind(this));
    }

    goToDefaultSettings(email){
        this.props.history.push("/default-settings")
    }

    logout(){
        var access_token = localStorage.getItem("access_token");
        var refresh_token = localStorage.getItem("refresh_token");
        var AuthStr = 'Bearer '.concat(access_token);
        var AuthStr2 = 'Bearer '.concat(refresh_token);
        const headers = {Authorization: AuthStr}
        const other = {Authorization: AuthStr2}
        axios.get('http://127.0.0.1:5000/logout', {headers})
        axios.get('http://127.0.0.1:5000/logout2', {headers: {'Authorization': AuthStr2}}).then((response) => {
            localStorage.clear();
            this.props.history.push("/login")
        })

    }


    componentDidMount() {
        var id = localStorage.getItem("id");
        var refresh_token = localStorage.getItem("refresh_token");
        var AuthStr = 'Bearer '.concat(refresh_token);
        axios.get('http://127.0.0.1:5000/refresh', {headers: {'Authorization': AuthStr}}).then((response) => {
            localStorage.setItem('access_token', response.data.access_token)
        }).catch((error) => {
            console.log(error, "ERROR - BAD REFRESH TOKEN");
        })
        var email = localStorage.getItem("email");
        var AuthStr = 'Bearer '.concat(id);
        axios.get('http://127.0.0.1:5000/get-data', {headers: {Authorization: AuthStr}, params: {email: email, id: id}}).then((response) => {
            this.setState({
                notes : response.data.notes,
                credentials : response.data.credentials
            })
        }).catch((error) => {
            console.log(error, "ERROR - INVALID or NO COOKIES");
        })
    }

    switchView(child){
        if(!child){
            this.setState({'isCardView': true})
        } else{
            this.setState({'isCardView': false})
        }
    }

    menu = (
        <Menu>
            <Menu.Item>
                <a>Document Category</a>
            </Menu.Item>
            <Menu.Item>
                <a>Date Modified</a>
            </Menu.Item>
            <Menu.Item>
                <a>Document Name</a>
            </Menu.Item>
        </Menu>
    );

    render() {
        if (this.state.isCardView){
            return (
                <div>
                    <Walkthrough runTutorial={this.state.credentials.runTutorial}/>
                    <Button type="primary" className="generateNewNote" onClick={() => this.createNote(this.state.credentials)}>New Document</Button>
                    <Button type="danger" className={"defaultSettings"} onClick={() => this.goToDefaultSettings(localStorage.getItem("email"))}>Default Settings</Button>
                    <Button type="primary" className="generateNewNote" onClick={() => this.logout()}>Log Out</Button>
                    <Switch checkedChildren="table" unCheckedChildren="card" defaultChecked onChange={(child) => this.switchView(child)}/>
                    <CardNote notes={this.state.notes} history={this.props.history}/>
                </div>
            )
        } else {
            return (
                <div>
                    <Walkthrough runTutorial={this.state.credentials.runTutorial}/>
                    <Button type="primary" className="generateNewNote" onClick={() => this.createNote(this.state.credentials)}>New Document</Button>
                    <Button type="danger" className={"defaultSettings"} onClick={() => this.goToDefaultSettings(localStorage.getItem("email"))}>Default Settings</Button>
                    <Button type="primary" className="generateNewNote" onClick={() => this.logout()}>Log Out</Button>
                    <Switch checkedChildren="table" unCheckedChildren="card" defaultChecked onChange={(child) => this.switchView(child)}/>
                    <Search
                        placeholder="input search text"
                        onSearch={value => console.log(value)}
                        style={{ width: 200 }}
                    />
                    <Dropdown overlay={this.menu}>
                        <a className="ant-dropdown-link" href="#">Sort By<Icon type="down" /> </a>
                    </Dropdown>
                    <Table dataSource={this.state.notes} className={"notesTable"} rowKey={"_id"}
                           columns={this.noteColumns}/>
                </div>
            )
        }
    }
}

export default withRouter(Dashboard);
