/* @flow */

import React, { Component } from 'react';
import {
	Container,
	Menu,
	Button
} from 'semantic-ui-react';
import {
  Route,
  Link
} from 'react-router-dom';


type PropsType = {
	sticky: boolean
};

type StateType =  {
	...any,
};

export default class NavBar extends Component<PropsType, StateType> {
	render() {
		if (this.props.sticky) {
			return (
				<Menu fixed='top' size='large'>
			     	<Container>
			         	<Menu.Item as='a' active>Home</Menu.Item>
			         	<Menu.Item as='a'>Work</Menu.Item>
			         	<Menu.Item as='a'>Company</Menu.Item>
			         	<Menu.Item as='a'>Careers</Menu.Item>
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
			        	<Menu.Item as='a' active>Home</Menu.Item>
			        	<Menu.Item as='a'>Work</Menu.Item>
			        	<Menu.Item as='a'>Company</Menu.Item>
			        	<Menu.Item as='a'>Careers</Menu.Item>
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

// export const NavBar = () => (


// 	<Container>
//       <Menu inverted pointing secondary size='large'>
//         <Menu.Item as='a' active>Home</Menu.Item>
//         <Menu.Item as='a'>Work</Menu.Item>
//         <Menu.Item as='a'>Company</Menu.Item>
//         <Menu.Item as='a'>Careers</Menu.Item>
//         <Menu.Item position='right'>
//           <Button as='a' inverted>Log in</Button>
//           <Button as='a' inverted style={{ marginLeft: '0.5em' }}>Sign Up</Button>
//         </Menu.Item>
//       </Menu>
//     </Container>

// )
