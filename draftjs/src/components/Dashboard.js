import React from 'react';
import { Table, Button, Switch, Input, Menu, Dropdown, Icon} from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import request from 'request';
import Walkthrough from './Walkthrough';
import Cookies from 'universal-cookie';
import axios from 'axios';
import '../css/dashboard.css';
import CardNote from "./CardNote";


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notes : null,
            credentials: null
        }
    }
    noteColumns = [{
        title:"Document Name",
        dataIndex: "title",
        key: "title"
    }, {
        title:"Date Created",
        dataIndex:"createdAt",
        key:"createdAt",
    }, {
        title:"Last Updated",
        dataIndex:"lastUpdated",
        key:"lastUpdated",
    },{
        title:"Category",
        dataIndex: "category",
        key: "category",
    }, {
        title: 'Action',
        key: 'action',
        render: (text,record) =>
            <div>
                <a className={"editNote"} onClick={() => this.editNote(this.props.location.state.credentials.email, record._id)}>Edit | </a>
                <a className={"deleteNote"} onClick={() => this.deleteNote(this.props.location.state.credentials.email, record._id)}>Delete</a>
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
            this.props.history.push({
                pathname: "/note/"+noteID,
                state: {
                    credentials: this.props.location.state.credentials,
                    noteData: JSON.parse(body)
                }
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
            window.location.reload();
        }.bind(this));
    }


    createNote(credentials){
        var email = credentials.email
        var postNewNote = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/new-note',
            qs: { email },
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(postNewNote, function (error, response, body) {
            if (response.statusCode === 401){
                this.setState({errors: body})
            } else {
                var js_body = JSON.parse(body);
                this.props.history.push({
                        pathname: "/new-note/" + js_body["_id"],
                        state: {
                        credentials: this.props.location.state.credentials,
                        notes: this.props.location.state.notes,
                        noteData: js_body
                    }
                })
            }
        }.bind(this));
    }

    goToDefaultSettings(email){
        var getDefaultSettings = {
            method: 'GET',
            url: 'http://127.0.0.1:5000/get-default-settings',
            qs:{email},
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(getDefaultSettings, function (error, response, body) {
            if (response.statusCode === 401){
                this.setState({errors: body})
            } else {
                const parsedData = JSON.parse(body)
                this.props.history.push({
                    pathname: "/default-settings",
                    state: {
                        credentials: parsedData.credentials,
                    }
                })
            }
        }.bind(this));
    }

    logout(credentials){
        const cookies = new Cookies();
        cookies.remove('email');
        cookies.remove('password');
        this.props.history.push({
            pathname: "/login"
        })
    }

    validate() {
        const cookies = new Cookies();
        if (cookies.get('email') == null) {
            return false
        }
        return true
    }

    componentDidMount() {
        const cookies2 = new Cookies()
        var id = cookies2.get('id')
        var email = cookies2.get('email')

        axios.get('http://127.0.0.1:5000/get-data', {params: {email: email, id: id}}).then((response) => {
            this.setState({
                notes : response.data.notes,
                credentials : response.data.credentials
            })
        }).catch((error) => {
            cookies2.remove('email');
            cookies2.remove('id');
            console.log("ERROR - INVALID or NO COOKIES");

        })
    }

    switchView(child){
        if(!child){
            this.setState({'isCardView': true})
        } else{
            this.setState({'isCardView': false})
        }
    }

    render() {
        const cookies1 = new Cookies();
        console.log("render email:", cookies1.get('email'))
        const Search = Input.Search;
        const menu = (
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
        if(this.validate()) {
            const {notes, credentials} = this.state
            if (notes, credentials === null) {
                return null
            }
            const cookies = new Cookies();
            cookies.set('email', cookies.get('email'), {path: '/', maxAge: 1800});
            cookies.set('id', cookies.get('id'), {path: '/', maxAge: 1800});
            for (var i = 0; i < this.state.notes.length; i++) {
                this.state.notes[i]["key"] = this.state.notes[i]["_id"];
            }
            if (this.state.isCardView){
                return (
                    <div>
                        <Walkthrough/>
                        <Button type="primary" className="generateNewNote"
                                onClick={() => this.createNote(this.state.credentials)}>New
                            Document</Button>

                        <Button type="danger" className={"defaultSettings"} onClick={() => this.goToDefaultSettings(cookies1.get('email'))}>Default
                            Settings</Button>
                        <Button type="primary" className="generateNewNote"
                                onClick={() => this.logout(this.state.credentials)}>Log Out</Button>
                        <Switch checkedChildren="table" unCheckedChildren="card" defaultChecked onChange={(child) => this.switchView(child)}/>
                        <CardNote notes={this.state.notes} history={this.props.history}/>
                    </div>
                )
            } else {
                return (
                    <div>
                        <Walkthrough/>
                        <Button type="primary" className="generateNewNote"
                                onClick={() => this.createNote(this.state.credentials)}>New
                            Document</Button>

                        <Button type="danger" className={"defaultSettings"} onClick={() => this.goToDefaultSettings(cookies1.get('email'))}>Default
                            Settings</Button>
                        <Button type="primary" className="generateNewNote"
                                onClick={() => this.logout(this.state.credentials)}>Log Out</Button>
                        <Switch checkedChildren="table" unCheckedChildren="card" defaultChecked onChange={(child) => this.switchView(child)}/>
                        <Search
                            placeholder="input search text"
                            onSearch={value => console.log(value)}
                            style={{ width: 200 }}
                        />
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" href="#">Sort By<Icon type="down" /> </a>
                        </Dropdown>
                        <Table dataSource={this.state.notes} className={"notesTable"}
                               columns={this.noteColumns}/>
                    </div>
                )
            }
        } else {
            return(
                <div>
                    <p>You are not logged in</p>
                </div>)
            }
        }


}

export default withRouter(Dashboard);
