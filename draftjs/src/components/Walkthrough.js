import React from 'react';
import { Table, Button } from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import request from 'request';
//import createHistory from "history/createBrowserHistory";
//const history = createHistory()
import Joyride from "react-joyride";
import PropTypes from "prop-types";

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

    static propTypes = {
        joyride: PropTypes.shape({
            callback: PropTypes.func
        })
    };

    static defaultProps = {
        joyride: {}
    };

    handleClickStart = e => {
        e.preventDefault();

        this.setState({
            run: true
        });
    };

    handleJoyrideCallback = data => {
        const { joyride } = this.props;
        const { type } = data;

        if (typeof joyride.callback === "function") {
            joyride.callback(data);
        } else {
            console.group(type);
            console.log(data); //eslint-disable-line no-console
            console.groupEnd();
        }
    };
    removeTutorial(_id){
        var editNote = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/remove-tutorial',
            qs: {_id},
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(editNote, function (error, response, body) {
            if (error) throw new Error(error);
            // this.props.history.push({
            //     pathname: "/note/"+noteID,
            //     state: {
            //         credentials: this.props.location.state.credentials,
            //         noteData: JSON.parse(body)
            //     }
            // });
            console.log(response)
        }.bind(this));
    }




    componentDidMount() {
        const cookies2 = new Cookies()
        var email = cookies2.get('email')
        var id = cookies2.get('id')
        // var _this = this
        axios.get('http://127.0.0.1:5000/get-data', {
            params: {
                email: email,
                id: id
            }
        }).then((response) => {


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
        const {notes, credentials} = this.state
        if (notes, credentials === null) {
            return null
        }
        // console.log("STATE", this.state)

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
