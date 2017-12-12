/* @flow */

import React, { Component } from 'react';
import {
	Container,
	Menu,
	Button
} from 'semantic-ui-react';
import {
  Route,
  NavLink
} from 'react-router-dom';


type PropsType = {
	sticky: boolean
};

type StateType =  {
	...any,
};

/*
<li><Link to='/'>Home</Link></li>
<li><Link to='/roster'>Roster</Link></li>
<li><Link to='/schedule'>Schedule</Link></li>
*/

/*
<NavLink
  to="/faq"
  activeClassName="selected"
>FAQs</NavLink>
*/

export default class NavBar extends Component<PropsType, StateType> {
	render() {
		if (this.props.sticky) {
			return (
				<Menu fixed='top' size='large'>
			     	<Container>
						<Menu.Item as={NavLink} exact to='/'>Home</Menu.Item>
						<Menu.Item as={NavLink} to='/features'>Features</Menu.Item>
						<Menu.Item as={NavLink} to='/about-us'>About Us</Menu.Item>
			         	<Menu.Item position='right'>
							<Button as='a'>Log in</Button>
							<Button as='a' primary style={{ marginLeft: '0.5em' }}>Sign Up</Button>
			         	</Menu.Item>
			     	</Container>
		     	</Menu>
			);
		}
		else {
			return (
				<Container>
			      	<Menu inverted pointing secondary size='large'>
						<Menu.Item as={NavLink} exact to='/' >Home</Menu.Item>
						<Menu.Item as={NavLink} to='/features'>Features</Menu.Item>
			         	<Menu.Item as={NavLink} to='/about-us'>About Us</Menu.Item>

			        	<Menu.Item position='right'>
			          		<Button as='a' inverted>Log in</Button>
			          		<Button as='a' inverted style={{ marginLeft: '0.5em' }}>Sign Up</Button>
			        	</Menu.Item>
			      	</Menu>
		    	</Container>

			);
		};
	};
};
