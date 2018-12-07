import React from "react";
import {CirclePicker} from "react-color";
import request from 'request';

 const NoteColor = (props) => {
     return (
         <div>
             <CirclePicker
                onChangeComplete={color => props.changeNoteColor(props.noteID, color)}
                colors={["#FCDFD7", "#FCF9DA", "#D4ECDC", "#E1EBF5", "#F0E5EB"]}
            />
        </div>
    );
 };

/*
class NoteColor extends React.Component {
    constructor(props){
        super(props)
        this.state={}
    }

    componentDidMount(){
        this.setState({noteColor: this.props.noteColor})
    }

    changeNoteColor(noteColor) {
        const noteID = this.props.noteID
        var changeNoteColor = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/change-note-color',
            qs: {noteID, noteColor: noteColor.hex},
            headers: {'Content-Type': 'application/x-www-form-urlencoded' }
        };
        request(changeNoteColor, function (error, response, body) {
            this.setState({ noteColor: noteColor.hex });
        }.bind(this));
    };

    render() {
        return (
            <div>
                <CirclePicker
                    color={this.state.noteColor}
                    onChangeComplete={color => this.changeNoteColor(color)}
                    colors={["#FCDFD7", "#FCF9DA", "#D4ECDC", "#E1EBF5", "#F0E5EB"]}
                />
            </div>
        );
    }
}
*/
export default NoteColor;