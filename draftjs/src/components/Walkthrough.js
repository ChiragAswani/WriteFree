import React from 'react';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import request from 'request';
import Joyride from "react-joyride";
import Cookies from 'universal-cookie';
import axios from 'axios';

class Walkthrough extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notes : null,
            credentials: null
        }
    }

    handleJoyrideCallback = data => {
        const { joyride } = this.props;
        const { type } = data;
        if (typeof joyride.callback === "function") {
            joyride.callback(data);
        }
    }

    removeTutorial(_id){
        var editNote = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/remove-tutorial',
            qs: {_id},
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(editNote, function (error, response, body) {}.bind(this));
    }

    componentDidMount() {
        const cookies2 = new Cookies()
        var email = cookies2.get('email')
        var id = cookies2.get('id')
        axios.get('http://127.0.0.1:5000/get-data', {params: {email: email, id: id}}).then((response) => {
            this.setState({
                notes : response.data.notes,
                credentials : response.data.credentials
            })
        }).catch((error) => {
            cookies2.remove('email');
            cookies2.remove('id');
        })

    }

    render() {
        const {notes, credentials} = this.state
        if (notes, credentials === null) {
            return null
        }
        return(
            <Joyride
                continuous
                scrollToFirstStep
                showProgress
                showSkipButton
                run={this.state.credentials.runTutorial}
                spotlightPadding={false}
                steps={[
                    {
                        content: <h2>Write Free Tutorial</h2>,
                        placement: "center",
                        disableBeacon: true,
                        styles: {
                            options: {
                                zIndex: 10000
                            }
                        },
                        locale: { skip: <a onClick={() => this.removeTutorial(this.state.credentials._id)}>Don't Show This Again</a> },
                        target: "body"
                    },
                    {
                        content: "Click here to create a new note!",
                        placement: "bottom",
                        styles: {
                            options: {
                                width: 900
                            }
                        },
                        target: ".generateNewNote",
                        title: "Create a New Note"
                    },
                    {
                        content: "Click here to change default settings!",
                        placement: "bottom",
                        styles: {
                            options: {
                                width: 900
                            }
                        },
                        target: ".defaultSettings",
                        title: "Change Default Note Settings"
                    },
                    {
                        content: "Here you can edit a note",
                        placement: "bottom",
                        styles: {
                            options: {
                                width: 900
                            }
                        },
                        target: ".editNote",
                        title: "Edit a Note"
                    },{
                        content: "Here you can delete a note",
                        placement: "bottom",
                        styles: {
                            options: {
                                width: 900
                            }
                        },
                        target: ".deleteNote",
                        title: "Delete a Note"
                    }]
                }
                callback={this.handleJoyrideCallback}
            />
        )
    }
}

export default withRouter(Walkthrough);
