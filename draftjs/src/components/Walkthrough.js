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
    }

    handleJoyrideCallback = data => {
        const { joyride } = this.props;
        const { type } = data;
        if (typeof joyride.callback === "function") {
            joyride.callback(data);
        }
    }

    removeTutorial(email){
        var editNote = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/remove-tutorial',
            qs: {email},
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(editNote, function (error, response, body) {}.bind(this));
    }

    render() {
        return(
            <Joyride
                continuous
                scrollToFirstStep
                showProgress
                showSkipButton
                run={this.props.runTutorial}
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
                        locale: { skip: <a onClick={() => this.removeTutorial(localStorage.getItem("email"))}>Don't Show This Again</a> },
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
                callback={() => this.handleJoyrideCallback}
            />
        )
    }
}

export default withRouter(Walkthrough);
