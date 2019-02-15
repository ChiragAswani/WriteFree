import {Button} from "antd";
import React from "react";
import axios from "axios";
import {backendURL} from "../../../dependency";

const ConvertToPDF = (props) => {
    function renderPDF(noteID, noteHTML, noteColor) {
        const parsedHTML = `<body style="background-color: ${noteColor};" >` + noteHTML + "</body>"
        document.body.style.backgroundColor = "#f5f5f5"
        axios.get(`${backendURL}/renderPDF`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded'}, params: { 'noteID' : noteID, 'noteHTML' : parsedHTML } }).then((response) => {
            window.open(response.request.responseURL)
        });

    }
    return (
        <Button
            className={'convert-to-pdf'}
            onClick={() => renderPDF(props.noteID, props.noteHTML, props.noteColor)}>
            Convert to PDF
        </Button>
    );
}

export default ConvertToPDF;