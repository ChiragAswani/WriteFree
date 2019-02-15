import {Switch} from "antd";
import React from "react";


const HyphenationOption = (props) => {
    return (
        <div>
            <p>Hyphenation</p>
            <Switch disabled defaultChecked={props.isHyphenated} checkedChildren="On" unCheckedChildren="Off" onChange={(child) => props.hyphenate(child, props.noteID)}/>
        </div>

    );
};

export default HyphenationOption;