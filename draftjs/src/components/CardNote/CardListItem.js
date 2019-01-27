import React from "react";
import {Card, Icon} from "antd";
import '../../css/cardnote.css';
import trash from '../../images/trashcan.png';

class CardListItem extends React.Component {
    constructor(props) {
        super(props);
        console.log("PROPS", props)
        this.state = {
            noteTitle: props.note.title,
            note: props.note,
        };
    }


    displayNoteData(note) {
        this.setState({
            moreNoteData:
                <div>
                    <div>
                        <Icon type="book" theme="filled" style={{'color': "#466fb5"}} />
                        {"  "}
                        {note.category}
                    </div>
                    <div>
                        {note.lastUpdated}
                    </div>
                </div>,
            noteDelete: <img height="40px" width="40px" src={trash} alt={"trash"}/>
        });
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
                    style={{ backgroundColor: this.state.note.noteColor, "borderRadius": "10px", "boxShadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", "width": "220px", "height":"220px" }}
                >
                    {this.state.noteTitle} <br />
                    <div className={"note-data-below"}>
                        {this.state.moreNoteData}
                    </div>

                </Card>
            </div>
        );
    }
}

export default CardListItem;