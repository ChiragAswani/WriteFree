import React from "react";
import {CirclePicker} from "react-color";
import request from 'request';

 const NoteColor = (props) => {
     return (
         <div>
             <CirclePicker
                 color={props.noteColor}
                onChangeComplete={color => props.changeNoteColor(props.noteID, color)}
                colors={["#FCDFD7", "#FCF9DA", "#D4ECDC", "#E1EBF5", "#F0E5EB"]}
            />
        </div>
    );
 };

export default NoteColor;