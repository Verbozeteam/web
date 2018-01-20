/* @flow */

import React, { Component } from 'react';

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
                <div>
                    NAV BAR STICKY
                </div>
            );
        }
        else {
            return (
                <div>
                    NAV BAR
                </div>
            );
        };
    };
};
