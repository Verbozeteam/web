/* @flow */

import React, { Component } from 'react';

import { withRouter } from 'react-router-dom'
import { connect as ReduxConnect } from 'react-redux';
import { AppWrapper } from "./redux/store";

import NavBar from './NavBar';
import Content from './Content';
import Footer from './Footer';

import css from '../../css/public_website/index.css';

type PropsType = {};

type StateType = {};


class App extends Component<PropsType, StateType> {

    render() {
        return (
            <div>
                <NavBar />
                <Content />
                <Footer />
            </div>
        );
    };
};

module.exports = {
    App: AppWrapper(withRouter(ReduxConnect(() => {return {}}, () => {return {}}) (App)))
}
