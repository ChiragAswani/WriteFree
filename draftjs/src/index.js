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
import createHistory from "history/createBrowserHistory";
const history = createHistory()

ReactDOM.render(
    <BrowserRouter >
        <Switch>
            <Route path="/create-account" component={CreateAccount} />
            <Route path="/login" component={Login} />
            <Route path="/dashboard" component={Dashboard}/>
            <Route path="/default-settings" component={DefaultSettings}/>
            <Route path="/note/:noteid" component={NewNote}/>
        </Switch>
    </BrowserRouter >,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
