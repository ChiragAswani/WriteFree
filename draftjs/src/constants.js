import React from "react";
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

export function handleAccountError(errorMessage){
    Alert.error(errorMessage, {
        position: 'top-right',
        effect: 'jelly'
    });
}

export function mergeSort(arr, option) {
    if (arr.length < 2)
        return arr;
    var middle = parseInt(arr.length / 2);
    var left   = arr.slice(0, middle);
    var right  = arr.slice(middle, arr.length);

    return merge(mergeSort(left), mergeSort(right), option);
}

function merge(left, right, option) {
    var result = [];
    while (left.length && right.length) {
        if (left[option] >= right[option]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
    while (left.length)
        result.push(left.shift());
    while (right.length)
        result.push(right.shift());
    return result;
}