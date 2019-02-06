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
import macbook from '../images/macbook.png';
import ipad from '../images/ipad.png';
import { Row, Col, Card } from 'antd';

class Landing extends React.Component {

	login() {
        this.props.history.push('/login')
    }

	render() {
    
	    return (
	      <div className={["testing"]}>
	      	<LandingNavigation/>
	      	<Row className={["centered-text", "full-container", "intro"]} style ={{ backgroundImage: "url("+book+")" }}>
	      		<Col span={24}>
		    		<p className={"header"}>A simple, free to use note taking application for people affected with dyslexia!</p>
		    		<Button style={{"height": "50px", "width": "200px", "font-size": "18px"}} onClick={() => this.login()} type="primary">Take me there!</Button>
	      		</Col>
	      	</Row>
	      	<Row className={"centered"}>
			    <Col xs={{ span: 24}} lg={{ span: 10}}>
			    	<Card className={["landing-card", "centered-text", "centered", "shadow"]}>
						<h2>Beautiful, personalized interface</h2>
						<h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi laoreet dapibus ultrices. Phasellus neque augue, bibendum nec sem ac, aliquam faucibus massa.</h5>
					</Card>
			    </Col>
			    <Col xs={{ span: 24}} lg={{ span: 14}}>
			    	<img className={"demo-images"} src={macbook}/>
			    </Col>
			</Row>
	      	<Row className={"centered"}>
		  		<Col xs={{ span: 24}} lg={{ span: 14}}>
					<img className={"demo-images"} src={ipad}/>
				</Col>
		    	<Col xs={{ span: 24}} lg={{ span: 10}}>
			    	<Card className={["landing-card", "centered-text", "centered", "shadow"]}>
			    		<h2>Easy to use tools made for people with Dyslexia</h2>
			    		<h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi laoreet dapibus ultrices. Phasellus neque augue, bibendum nec sem ac, aliquam faucibus massa.</h5>
			    	</Card>
			    </Col>
		    </Row>
		    <Row className={["centered-text"]}>
		    	<Col span={24}>
		    		<Col span={12} offset={6}>
		    			<Card className={["styled-card", "shadow"]}>
							<p>WriteFree is a not for profit, open-source application! Help contribute to our cause</p>
						</Card>
		    		</Col>
		    		<Col span={12} offset={6}>
		    			<a target="_blank" href="https://github.com/ChiragAswani/WriteFree-backend"><Button style={{"height": "50px", "width": "200px", "font-size": "18px", "margin":"20px"}} type="primary">Github</Button></a>
		    			<a target="_blank" href="#"><Button style={{"height": "50px", "width": "200px", "font-size": "18px", "margin":"20px"}} type="primary">Donate</Button></a>
		    		</Col>
		    	</Col>
		    </Row>
		    <Row className={["centered-text"]}>
		    	<Col span={24}>
		    		<h3>WriteFree is an <a target="_blank" href="https://instituteofethics.org"><b>Institute of Ethics</b></a> initiative!</h3>
		    	</Col>
		    </Row>
	      	
	      </div>
	    );
  	}
}

export default withRouter(Landing);