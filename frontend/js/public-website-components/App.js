/* @flow */

import React, { Component } from 'react'
import {
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Icon,
    Image,
    List,
    Menu,
    Segment,
    Visibility,
} from 'semantic-ui-react'

import { connect as ReduxConnect } from 'react-redux';
import { AppWrapper } from "./redux/store";

import NavBar from './NavBar';
import Home from './Home';
import { RoomDemoComponent } from './RoomDemoComponent';
import { Footer } from './Footer'

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
                    onTopPassed={this.showStickyMenu}
                    onTopVisible={this.hideStickyMenu}
                    once={false}
                >
                    <Segment
                        inverted
                        textAlign='center'
                        style={{ minHeight: 700, padding: 0 }}
                        vertical
                    >

                        <NavBar sticky={false} />

                        <RoomDemoComponent />

                    </Segment>
                </Visibility>

                <Home />

                <Footer/>
            </div>
        )
    }
}

module.exports = {
    App: AppWrapper(ReduxConnect(() => {return {}}, () => {return {}}) (App))
}
