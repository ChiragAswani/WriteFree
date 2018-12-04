import request from "request";
import {Select, Slider} from "antd";
import React from "react";
const Option = Select.Option;

const WordSpacingOption = (props) => {
    function changeWordSpacing(value) {
        const obj = {'noteID': props.noteID, 'wordSpacing': value}
        const changeWordSpacing = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/change-word-spacing',
            body: JSON.stringify(obj),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        };
        request(changeWordSpacing, (error, response, body) => {
            props.setDocumentWordSpacing(value);
        });
    }

    const marks = {
        0.9: '0.0px',
        1: 'normal',
        10: '10px',
        20: '20px',
        50: '50px',
    };

    return (
        <div>
            <h4>Word Spacing</h4>
            <Slider style={{'width': 500}} marks={marks} step={null} defaultValue={1}/>
            <Select
                defaultValue={props.wordSpacing}
                style={{width: 150}} max={51}
                onChange={(value) => changeWordSpacing(value)}
            >
                <Option value="0.9px" disabled>Word Spacing</Option>
                <Option value="normal">Default</Option>
                <Option value="10px">10px</Option>
                <Option value="20px">20px</Option>
                <Option value="50px">50px</Option>
            </Select>
        </div>
    );
}

export default WordSpacingOption;