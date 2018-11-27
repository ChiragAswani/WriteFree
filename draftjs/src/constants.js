import React from "react";
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import request from "request";

export function handleAccountError(errorMessage){
    Alert.error(errorMessage, {
        position: 'top-right',
        effect: 'jelly'
    });
}