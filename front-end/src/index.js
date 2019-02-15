import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, BrowserRouter} from "react-router-dom";
import './css/index.css';
import CreateAccount from './components/CreateAccount';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import NewNote from './components/Editor/Note';
import DefaultSettings from './components/DefaultSettings';
import * as serviceWorker from './serviceWorker';
import { library } from '@fortawesome/fontawesome-svg-core'
import {faUser} from '@fortawesome/free-solid-svg-icons'
import Error404 from "./components/Error404";
import Landing from "./components/Landing";
library.add( faUser)

ReactDOM.render(
    <BrowserRouter >
        <Switch>
            <Route path="/create-account" component={CreateAccount} />
            <Route path="/login" component={Login} />
            <Route path="/dashboard" component={Dashboard}/>
            <Route path="/default-settings" component={DefaultSettings}/>
            <Route path="/note/:noteid" component={NewNote}/>
            <Route path="/" component={Landing}/>

        </Switch>
    </BrowserRouter >,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
