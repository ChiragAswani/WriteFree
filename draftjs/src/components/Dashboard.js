import React from 'react';
import { Table, Button } from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import request from 'request';
<<<<<<< Updated upstream
//import createHistory from "history/createBrowserHistory";
//const history = createHistory()
=======
import Joyride from "react-joyride";
import PropTypes from "prop-types";
import Walkthrough from './Walkthrough';
import Cookies from 'universal-cookie';
import axios from 'axios';
>>>>>>> Stashed changes

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
                title:"Category",
                dataIndex: "category",
                key: "category",
            }, {
                title: 'Action',
                key: 'action',
                render: (text,record) =>
                    <div>
<<<<<<< Updated upstream
                        <a onClick={() => this.editNote(this.props.location.state.credentials.email, record._id)}>Edit | </a>
                        <a onClick={() => this.deleteNote(this.props.location.state.credentials.email, record._id)}>Delete</a>
=======
                        <a className={"editNote"} onClick={() => this.editNote(this.state.credentials.email, record._id)}>Edit | </a>
                        <a className={"deleteNote"} onClick={() => this.deleteNote(this.state.credentials.email, record._id)}>Delete</a>
>>>>>>> Stashed changes
                    </div>,
            }],
            notes : null,
            credentials: null

        }



    }



    editNote(email, noteID){
        var editNote = {
            method: 'GET',
            url: 'http://127.0.0.1:5000/fetch-note',
            qs: { email, noteID },
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(editNote, function (error, response, body) {
            if (error) throw new Error(error);
            this.props.history.push({
                pathname: "/new-note",
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
            if (error) throw new Error(error);
            this.props.history.push({
                pathname: "/dashboard",
                state: {
                    credentials: this.props.location.state.credentials,
                    noteData: this.props.location.state.noteData
                }
            });
        }.bind(this));
    }

    rowSelection(){
        var rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
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
<<<<<<< Updated upstream
            } else {
                console.log(body)
                this.props.history.push({
                    pathname: "/new-note",
                    state: {
                        credentials: this.props.location.state.credentials,
                        noteData: JSON.parse(body)
=======
            } else
            {
                //convert body to json format
                var js_body = JSON.parse(body);
                this.props.history.push({
                    pathname: "/new-note/" + js_body["_id"],
                    state: {
                        credentials: this.state.credentials,
                        notes: this.state.notes,
                        noteData: js_body
>>>>>>> Stashed changes
                    }
                })
            }
        }.bind(this));
    }

<<<<<<< Updated upstream
    render() {
        console.log(this.state)
        console.log(this.props)
        return (
            <div>
            <Button type="primary" onClick={() => this.generateNewNote(this.props.location.state.credentials.email)}>New Note</Button>
                <Table  rowSelection={this.rowSelection} dataSource={this.props.location.state.userData} columns={this.state.columns} />
            </div>
        )
=======
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
        const cookies = new Cookies();
        var temp = cookies.get('email'); // Pacman
        if (temp) {


            this.getData(cookies.get('email'),cookies.get('password'))
            return true

        }
        return false
    }

    getData(email, password) {

        var postLoginInformation = {
            method: 'GET',
            url: 'http://127.0.0.1:5000/login',
            qs:{email, password },
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };

        request(postLoginInformation, function (error, response, body) {
            if (error) throw new Error(error);
            if (response.statusCode === 401){
                this.setState({errors: body})
            } else {

                const parsedData = JSON.parse(body)

                return parsedData.notes, parsedData.credentials
                //this.setState = ({ notes: parsedData.notes, credentials: parsedData.credentials});
                // this.setState({
                //     notes: parsedData.notes,
                //     credentials: parsedData.credentials
                // }, () => {
                //     console.log("doneeeeee~~~")
                // });


            }
        }.bind(this));


    }


    componentDidMount() {
        const cookies2 = new Cookies()
        var password = cookies2.get('password')
        var email = cookies2.get('email')
        // var _this = this
        axios.get('http://127.0.0.1:5000/login', {
            params: {
                email: email,
                password: password
            }
        }).then((response) => {
            console.log(this.props.history.location.state)
            this.setState({
                notes : response.data.notes,
                credentials : response.data.credentials
            })


        }).catch((error) => {
            this.render(<div> <p> You are not logged in</p></div>)
        })


            //email,password).then((notes, credentials) => this.setState({ notes, credentials }))

    }


    render() {
        const { notes, credentials } = this.state
        if (notes,credentials === null) { return null }


            //console.log("STATE", this.state)
            //console.log("HISTORY", this.props.location.state)

            const cookies = new Cookies();
            cookies.set('email', cookies.get('email'), { path: '/', maxAge: 1800 });
            cookies.set('password', cookies.get('password'), { path: '/', maxAge: 1800 });

            //convert the userDate from the login page to the dateSource so that it can be used in Table opeartions

            for (var i = 0; i < this.state.notes.length; i++){

                this.state.notes[i]["key"] = this.state.notes[i]["_id"];
            }

        return (
                <div>
                    <Walkthrough/>
                    <Button type="primary" className="generateNewNote"
                            onClick={() => this.generateNewNote(this.state.credentials)}>New
                        Note</Button>
                    <Button type="danger" className={"defaultSettings"} onClick={() => this.goToDefaultSettings()}>Default Settings</Button>
                    <Table rowSelection={this.rowSelection()} dataSource={this.state.notes} className={"notesTable"}
                           columns={this.state.columns}/>

                </div>
            )



>>>>>>> Stashed changes
    }
}

export default withRouter(Dashboard);
