import React from 'react';
import { Table, Button, Switch, Card } from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import request from 'request';

//import createHistory from "history/createBrowserHistory";
//const history = createHistory()

import Joyride from "react-joyride";
import PropTypes from "prop-types";
import Walkthrough from './Walkthrough';

import Cookies from 'universal-cookie';
import axios from 'axios';

import '../css/dashboard.css';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [{
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
            }],
            notes : null,
            credentials: null
        }
    }

    editNote(email, noteID){
        var editNote = {
            method: 'GET',
            url: 'http://127.0.0.1:5000/fetch-note/'+ String(noteID),
            qs: { email, noteID },
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(editNote, function (error, response, body) {
            if (error) throw new Error(error);
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
        //console.log(this.props.location.state.notes);
        var deleteNote = {
            method: 'DELETE',
            url: 'http://127.0.0.1:5000/delete-note',
            qs: { email, noteID },
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(deleteNote, function (error, response, body) {
            if (error) throw new Error(error);
            const parsedData = JSON.parse(body);

            // TODO: FIX THIS SO IT DOESNT HAVE TO RELOAD THE PAGE
            // this.props.history.push({
            //     pathname: "/dashboard",
            //     state: {
            //         credentials: this.state.credentials,
            //         notes: parsedData.notes
            //     }
            // });
            window.location.reload();
        }.bind(this));
    }

    rowSelection(){
        var rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        return rowSelection;
    }

    generateNewNote(credentials){
        var email = credentials.email
        var postNewNote = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/new-note',
            qs: { email },
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(postNewNote, function (error, response, body) {
            if (error) throw new Error(error);
            if (response.statusCode === 401){
                this.setState({errors: body})
            } else
                {
                    //convert body to json format
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
            if (error) throw new Error(error);
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
    // Depreciated
    // getData(email, password) {
    //
    //     var postLoginInformation = {
    //         method: 'GET',
    //         url: 'http://127.0.0.1:5000/login',
    //         qs:{email, password },
    //         headers: {'Content-Type': 'application/x-www-form-urlencoded' }
    //     };
    //
    //     request(postLoginInformation, function (error, response, body) {
    //         if (error) throw new Error(error);
    //         if (response.statusCode === 401){
    //             this.setState({errors: body})
    //         } else {
    //
    //             const parsedData = JSON.parse(body)
    //
    //             return parsedData.notes, parsedData.credentials
    //             //this.setState = ({ notes: parsedData.notes, credentials: parsedData.credentials});
    //             // this.setState({
    //             //     notes: parsedData.notes,
    //             //     credentials: parsedData.credentials
    //             // }, () => {
    //             //     console.log("doneeeeee~~~")
    //             // });
    //
    //
    //         }
    //     }.bind(this));
    //
    //
    // }
    componentDidMount() {
        const cookies2 = new Cookies()
        var id = cookies2.get('id')
        var email = cookies2.get('email')

        axios.get('http://127.0.0.1:5000/get-data', {
            params: {
                email: email,
                id: id
            }
        }).then((response) => {

            //console.log(this.props.history.location.state)
            this.setState({
                notes : response.data.notes,
                credentials : response.data.credentials
            })


        }).catch((error) => {
            // Set cookie to null
            cookies2.remove('email');
            cookies2.remove('id');
            console.log("ERROR - INVALID or NO COOKIES");

        })
            //email,password).then((notes, credentials) => this.setState({ notes, credentials }))
    }

    render() {
        const cookies1 = new Cookies();
        console.log("render email:", cookies1.get('email'))
        if(this.validate()) {
            const {notes, credentials} = this.state
            if (notes, credentials === null) {
                return null
            }
            //console.log("HISTORY", this.props.location.state)

            const cookies = new Cookies();
            cookies.set('email', cookies.get('email'), {path: '/', maxAge: 1800});
            cookies.set('id', cookies.get('id'), {path: '/', maxAge: 1800});

            //convert the userDate from the login page to the dateSource so that it can be used in Table opeartions

            for (var i = 0; i < this.state.notes.length; i++) {

                this.state.notes[i]["key"] = this.state.notes[i]["_id"];
            }

            return (
                <div>
                    <Walkthrough/>
                    <Button type="primary" className="generateNewNote"
                            onClick={() => this.generateNewNote(this.state.credentials)}>New
                        Note</Button>

                    <Button type="danger" className={"defaultSettings"} onClick={() => this.goToDefaultSettings(cookies1.get('email'))}>Default
                        Settings</Button>
                    <Button type="primary" className="generateNewNote"
                            onClick={() => this.logout(this.state.credentials)}>Log Out</Button>
                    <Table rowSelection={this.rowSelection()} dataSource={this.state.notes} className={"notesTable"}
                           columns={this.state.columns}/>
                    <Switch checkedChildren="table" unCheckedChildren="card" defaultChecked onChange={() => this.switchView()}/>

                    <div className="cont">
                        <Card className="item">Card content</Card>
                        <Card className="item">Card content</Card>
                        <Card className="item">Card content</Card>
                        <Card className="item">Card content</Card>
                        <Card className="item">Card content</Card>
                        <Card className="item">Card content</Card>
                    </div>
                </div>
            )
        } else {
            return(
                <div>
                    <p>You are not logged in</p>
                </div>)
            }
        }


}

export default withRouter(Dashboard);
