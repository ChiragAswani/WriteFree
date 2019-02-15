import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import React from 'react';
import ReactDOM from 'react-dom'
import { withRouter } from 'react-router-dom';
import Error404 from '../components/Error404';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(withRouter(<Error404 />), div);
});