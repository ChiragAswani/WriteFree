import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';

export function handleAccountError(errorMessage) {
  Alert.error(errorMessage, {
    position: 'top-right',
    effect: 'jelly',
  });
}

function merge(left, right, option) {
  const result = [];
  while (left.length && right.length) {
      if (option === 'lastUpdated'){
          if (Date.parse(left[0][option]) >= Date.parse(right[0][option])) {
              result.push(left.shift());
          } else {
              result.push(right.shift());
          }
      } else {
          if (left[0][option].charCodeAt(0) <= right[0][option].charCodeAt(0)) {
              result.push(left.shift());
          } else {
              result.push(right.shift());
          }
      }
  }

  while (left.length) {
    result.push(left.shift());
  }
  while (right.length) {
    result.push(right.shift());
  }
  return result;
}

export function mergeSort(arr, option) {
  if (arr.length < 2) {
    return arr;
  }
  const middle = parseInt(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle, arr.length);

  return merge(mergeSort(left, option), mergeSort(right, option), option);
}

