import request from "request";
import {Select, Slider} from "antd";
import React from "react";
const Option = Select.Option;

const LineSpacingOption = (props) => {

    function changeLineSpacing(value) {
        const obj = {'noteID': props.noteID, 'lineSpacing': value}
        const changeLineSpacing = {
            method: 'POST',
            url: 'http://127.0.0.1:5000/change-line-spacing',
            body: JSON.stringify(obj),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        };
        request(changeLineSpacing, (error, response, body) => {
            props.setDocumentLineSpacing(value);
        });
    }

    const marks = {
        0.06: 'Default',
        0.6: '1.6',
        1: '2',
        4: '5',
    };

    return (
        <div>
            <h4>Line Spacing</h4>
            <Slider style={{ width: 400, margin: 50 }} marks={marks} step={null} defaultValue={0.06} />
            <Select defaultValue={props.lineSpacing} style={{ width: 150 }} onChange={(value) => changeLineSpacing(value)}>
            <Option value="0.05" disabled>Line Spacing</Option>
            <Option value="0.06">Default</Option>
            <Option value="0.6">1.6</Option>
            <Option value="1">2</Option>
            <Option value="4">5</Option>
            </Select>

        </div>
    );

}

export default LineSpacingOption;