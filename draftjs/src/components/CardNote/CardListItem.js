import React from "react";
import {Card} from "antd";
import '../../css/cardnote.css';

class CardListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noteTitle: props.note.title,
            note: props.note,
        };
    }
    displayNoteData(note) {
        this.setState({ moreNoteData: `${note.lastUpdated} | ${note.category}`, noteDelete: <img height="40px" width="40px" src={"https://github.com/ChiragAswani/Husky-Test/blob/master/delete@3x.png?raw=true"} />});
    }
    editNote(email, noteID) {
        this.props.history.push({
            pathname: `/note/${noteID}`,
            state: { noteID },
        });
    }

    render() {
        return (
            <div className={"card"}>
                <Card
                    extra={this.state.noteDelete}
                    onClick={() => this.editNote(localStorage.getItem('email'), this.state.note._id)}
                    onMouseEnter={() => this.displayNoteData(this.state.note)}
                    onMouseLeave={() => this.setState({ moreNoteData: undefined, noteDelete: undefined })}
                    style={{ backgroundColor: this.state.note.noteColor, "border-radius": "10px", "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}
                >
                    {this.state.noteTitle} <br />
                    {this.state.moreNoteData}
                </Card>
            </div>
        );
    }
}

export default CardListItem;