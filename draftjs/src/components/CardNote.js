import React from 'react';
import { Table, Button, Switch, Card } from 'antd';
import 'antd/dist/antd.css';
import {withRouter} from "react-router-dom";
import request from 'request';

import Cookies from 'universal-cookie';
import axios from 'axios';

import '../css/cardnote.css';

class CardListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'noteTitle': props.note.title,
            'note': props.note
        }
    }
    displayNoteData(note){
        this.setState({'moreNoteData': note['lastUpdated'] + " | " + note['category'], 'noteDelete': <a>x</a>})
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
                    credentials: this.props.history.location.state.credentials,
                    noteData: JSON.parse(body)
                }
            });
        }.bind(this));
    }

    render() {
        return(
            <div >
                <Card
                    extra={this.state.noteDelete}
                    onClick={() => this.editNote("chirag@aswani.net", this.state.note._id)}
                    onMouseEnter={() => this.displayNoteData(this.state.note)}
                    onMouseLeave={() => this.setState({'moreNoteData': undefined, 'noteDelete': undefined})}
                >
                    {this.state.noteTitle} <br/>
                    {this.state.moreNoteData}
                </Card>
            </div>
        );
    }
}

const CardList = (props) => {
    const videoItems = props.notes.map((note) =>{
        return(<CardListItem key={note._id} note={note} history={props.history}/>)
    })
    return(
        <ul className="col-md-4 list-group">
            {videoItems}
        </ul>
    );
}

class CardNote extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
            return (
                <div className="cont">
                    <CardList notes={this.props.notes} history={this.props.history}/>
                </div>
            )
        }
}

export default withRouter(CardNote);
