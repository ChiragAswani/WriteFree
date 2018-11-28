import React from 'react';
import { Button } from 'antd';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom';

const DashBoardButton = props => (
  <Button type="primary" onClick={() => props.history.push('/dashboard')}>Go To Dashboard</Button>
);

export default withRouter(DashBoardButton);
