import Speech from "react-speech";
import React from "react";

const SpeechOption = (props) => {
    function speechNote(noteContent) {
        var text = '';
        for (var line in noteContent.blocks){
            text = text + (noteContent.blocks[line].text) + ". "
        }
        return text
    }
    return (
        <Speech
            text={speechNote(props.speechText)}
            displayText={"Text to Speech"}
            textAsButton={true}
            voice="Google UK English Female" />
    );
};

export default SpeechOption;