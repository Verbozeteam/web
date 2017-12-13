/* @flow */

import React, { Component } from 'react';
import {
	Container,
	Menu,
	Button
} from 'semantic-ui-react';
import {
  NavLink
} from 'react-router-dom';


type PropsType = {
	sticky: boolean
};

type StateType =  {
	...any,
};

/*
				<Segment inverted style={ styles.featureHeaderSegment }>
					<Container text>
						<div style={{ textAlign: 'center' }}>
							<img style={ styles.logo } src={this._verboze_logo} />
						</div>
					</Container>
				</Segment>

    logo: {
		width: 200,
    }
	featureHeaderSegment: {
		padding: '3em 0em',
		borderRadius: 0,
		margin: 0
	},

*/


export default class NavBar extends Component<PropsType, StateType> {
	_verboze_logo = require('../../assets/images/logo_symbol.png');

	render() {
		if (this.props.sticky) {
			return (
				<Menu fixed='top' size='large'>
			     	<Container>
			     		<img style={ styles.logo } src={this._verboze_logo} />
						<Menu.Item as={NavLink} exact to='/'>Home</Menu.Item>
						<Menu.Item as={NavLink} to='/features'>Features</Menu.Item>
						<Menu.Item as={NavLink} to='/about-us'>About Us</Menu.Item>
			     	</Container>
		     	</Menu>
			);
		}
		else {
			return (
				<Container>
			      	<Menu inverted pointing secondary size='large'>
						<img style={ styles.logo } src={this._verboze_logo} />
						<Menu.Item as={NavLink} exact to='/' >Home</Menu.Item>
						<Menu.Item as={NavLink} to='/features'>Features</Menu.Item>
			         	<Menu.Item as={NavLink} to='/about-us'>About Us</Menu.Item>
			      	</Menu>
		    	</Container>
			);
		};
	};
};

const styles = {
    logo: {
    	marginLeft: -85,
    	paddingRight: 25,
		height: 45
    }
}