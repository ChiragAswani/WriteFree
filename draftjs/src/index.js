import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, BrowserRouter, withRouter} from "react-router-dom";
import './css/index.css';
import CreateAccount from './components/CreateAccount';
import Login from './components/Login';
import createHistory from "history/createBrowserHistory"
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <BrowserRouter >
        <Switch>
            <Route path="/create-account" component={CreateAccount} />
            <Route path="/login" component={Login} />
        </Switch>
    </BrowserRouter >,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
