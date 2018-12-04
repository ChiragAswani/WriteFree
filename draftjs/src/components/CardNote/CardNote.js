import React from 'react';
import CardList from './CardList';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom';
import '../../css/cardnote.css';

const CardNote = props => (
  <div className="cont">
    <CardList notes={props.notes} history={props.history} />
  </div>
);

export default withRouter(CardNote);
