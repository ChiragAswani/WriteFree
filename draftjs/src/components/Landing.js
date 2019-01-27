/* eslint-disable */
import React from 'react';
import { Table, Button, Switch, Input, Menu, Dropdown, Icon, Popconfirm } from 'antd';
import 'antd/dist/antd.css';
import { withRouter } from 'react-router-dom';
import request from 'request';
import axios from 'axios';
import Walkthrough from './Walkthrough';
import CardNote from './CardNote/CardNote';
import LandingNavigation from './LandingNavigation';
import '../css/landing.css';
import { mergeSort } from '../defaults/constants';
import features from '../images/features.png';
import layout from '../images/layout.png';
import book from '../images/book_landing.png';
import { Row, Col, Card } from 'antd';

class Landing extends React.Component {

	login() {
        this.props.history.push('/login')
    }

	render() {
    
	    return (
	      <div className={["testing"]}>
	      	<LandingNavigation/>
	      	<Row className={["centered-text", "full-container", "intro", "centered"]} style ={ { backgroundImage: "url("+book+")" } }>
	      		<Col span={24}>
		    		<p className={"header"}>A simple, free to use note taking application for people affected with dyslexia!</p>
		    		<Button onClick={() => this.login()} type="primary">Take me to the App!</Button>
	      		</Col>
	      	</Row>
	      	<Row className={"centered"}>
			    <Col xs={{ span: 24}} lg={{ span: 12}}>
			    	<Card className={["landing-card", "centered-text"]}>
						<p>Beautiful, personalized interface</p>
					</Card>
			    </Col>
			    <Col xs={{ span: 24}} lg={{ span: 12}}>
			    	<img className={"demo-images"} src={layout}/>
			    </Col>
			</Row>
	      	<Row className={"centered"}>
		  		<Col xs={{ span: 24}} lg={{ span: 12}}>
					<img className={"demo-images"} src={features}/>
				</Col>
		    	<Col className={"centered"} xs={{ span: 24}} lg={{ span: 12}}>
			    	<Card className={["landing-card", "centered-text"]}>
			    		Easy to use tools made for people with Dyslexia
			    	</Card>
			    </Col>
		    </Row>
		    <Row className={["centered-text", "full-container"]}>
		    	<Col span={24}>
		    		<Col span={12} offset={6}>
		    			<Card className={"landing-card"}>
							<p>WriteFree is a not for profit, open-source application! Help contribute to our cause</p>
						</Card>
		    		</Col>
		    		<Col span={12} offset={6}>
		    			<a target="_blank" href="https://github.com/ChiragAswani/WriteFree-backend"><Button type="primary">Github</Button></a>
		    			<a target="_blank" href="#"><Button type="primary">Donate</Button></a>
		    		</Col>
		    	</Col>
		    </Row>
	      	
	      </div>
	    );
  	}
}

export default withRouter(Landing);