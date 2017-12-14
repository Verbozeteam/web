/* @flow */

import React, { Component } from 'react';
import {
    Container,
    Menu,
    Button
} from 'semantic-ui-react';
import {
  NavLink,
  Link
} from 'react-router-dom';


type PropsType = {
    sticky: boolean
};

type StateType =  {
    ...any,
};


export default class NavBar extends Component<PropsType, StateType> {
    _verboze_logo = require('../../assets/images/logo_symbol.png');

    render() {
        if (this.props.sticky) {
            return (
                <Menu fixed='top' size='large'>
                    <Container>
                        <Menu.Item as={NavLink} activeClassName="" exact to='/'>
                            <img src={this._verboze_logo} />
                        </Menu.Item>
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
                        <Menu.Item as={NavLink} activeClassName="" exact to='/'>
                            <img style={ styles.logo } src={this._verboze_logo} />
                        </Menu.Item>
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
        marginTop: -10,
        marginBottom: -10
    }
}