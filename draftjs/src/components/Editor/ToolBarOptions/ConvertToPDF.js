import {Button} from "antd";
import React from "react";

const ConvertToPDF = (props) => {
    console.log(props.noteID)
    return (
        <Button
            className={'convert-to-pdf'}
            onClick={() => window.open("http://www.localhost:5000/renderPDF?noteID="+props.noteID)}>
            Convert to PDF
        </Button>
    );
}

export default ConvertToPDF;