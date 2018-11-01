import React from 'react';
import { Table, Button } from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import request from 'request';
//import createHistory from "history/createBrowserHistory";
//const history = createHistory()

import {Helmet} from 'react-helmet';

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
                        <a onClick={() => this.editNote(this.props.location.state.credentials.email, record._id)}>Edit | </a>
                        <a onClick={() => this.deleteNote(this.props.location.state.credentials.email, record._id)}>Delete</a>
                    </div>,
            }]
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
            this.props.history.push({
                pathname: "/dashboard",
                state: {
                    credentials: this.props.location.state.credentials,
                    notes: parsedData.notes
                }
            });
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

    generateNewNote(email){
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

    goToDefaultSettings(){
        this.props.history.push({
            pathname: "/default-settings",
            state: {
                credentials: this.props.location.state.credentials,
                notes: this.props.location.state.notes
            }
        })
    }

    validate() {
        let key = 'email';
        if (!sessionStorage.getItem(key)) {
            return false
        }
        return true
    }

    render() {
        //console.log("STATE", this.state)
        //console.log("HISTORY", this.props.location.state)
        if(this.validate()) {
            //convert the userDate from the login page to the dateSource so that it can be used in Table opeartions
            for (var i = 0; i < this.props.location.state.notes.length; i++){

                this.props.location.state.notes[i]["key"] = this.props.location.state.notes[i]["_id"];
            }
            return (

                <div>

                    <Button type="primary"
                            onClick={() => this.generateNewNote(this.props.location.state.credentials.email)}>New
                        Note</Button>
                    <Button type="danger" onClick={() => this.goToDefaultSettings()}>Default Settings</Button>
                    <Table rowSelection={this.rowSelection()} dataSource={this.props.location.state.notes}
                           columns={this.state.columns}/>
                </div>
            )
        } else {
            return (
                <div>
                    <p>You are not logged in</p>
                </div>
            )
        }
    }
}

export default withRouter(Dashboard);
