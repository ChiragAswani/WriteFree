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

export async function getNotesByEmail(email){
    var getNotes = {
        method: 'GET',
        url: 'http://127.0.0.1:5000/get-notes',
        qs:{email},
        headers: {'Content-Type': 'application/x-www-form-urlencoded' }
    };
    return await request(getNotes, function (error, response, body) {
        return JSON.parse(body)
    })
}