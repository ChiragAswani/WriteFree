import {Switch} from "antd";
import React from "react";


const HyphenationOption = (props) => {
    return (
        <div>
            <p>Hyphenation</p>
            <Switch checkedChildren="On" unCheckedChildren="Off" onChange={(child) => props.hyphenate(child)}/>
        </div>

    );
}

export default HyphenationOption;