/* @flow */

import React, { Component } from 'react';
import {
    Segment,
    Visibility,
} from 'semantic-ui-react';

import { withRouter } from 'react-router-dom'
import { connect as ReduxConnect } from 'react-redux';
import { AppWrapper } from "./redux/store";

import NavBar from './NavBar';
import Content from './Content';
import { Footer } from './Footer';

type PropsType = {
    ...any,
};

type StateType = {
    ...any,
};


class App extends Component<PropsType, StateType> {

    state = {}

    hideStickyMenu = () => this.setState({ visible: false })
    showStickyMenu = () => this.setState({ visible: true })

    render() {
        const { visible } = this.state

        return (
            <div>
                { visible ? <NavBar sticky={true}  /> : null }
                <Visibility
                    onBottomPassed={this.showStickyMenu}
                    onBottomVisible={this.hideStickyMenu}
                    once={false} >
                    <Segment
                        inverted
                        textAlign='center'
                        vertical >

                        <NavBar sticky={false} />

                    </Segment>
                </Visibility>

                <Content />

                <Footer />
            </div>
        );
    };
};

module.exports = {
    App: AppWrapper(withRouter(ReduxConnect(() => {return {}}, () => {return {}}) (App)))
}
