/* @flow */

import React, { Component } from 'react';
import {
	Container,
	Menu,
	Button
} from 'semantic-ui-react';


export const NavBar = () => (

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
)
