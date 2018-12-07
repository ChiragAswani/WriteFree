import React from 'react';
import ReactDOM from 'react-dom';
import CreateAccount from '../src/components/CreateAccount';
import {shallow} from 'enzyme';

it('renders without crashing', () => {
    shallow(<CreateAccount />);
});
