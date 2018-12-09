import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import React from 'react';
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router-dom';
import NoteColor from '../../../components/Editor/ToolBarOptions/NoteColor';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(withRouter(<NoteColor/>), div);
});