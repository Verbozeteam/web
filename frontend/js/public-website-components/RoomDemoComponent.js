/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react'
import { connect as ReduxConnect } from 'react-redux';

import * as APITypes from '../api-utils/APITypes';
import * as ConnectionTypes from '../api-utils/ConnectionTypes';
import { APICaller } from '../api-utils/API';
import { WebSocketCommunication } from '../api-utils/WebSocketCommunication';

import * as tabletActions from './redux/actions/tabletstate';
import * as connectionActions from './redux/actions/connection';

import { RoomDemoControls } from './RoomDemoControls';
import { RoomState } from './room-state/RoomState';

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setConnectionURL: u => dispatch(tabletActions.setCurrentConnectionURL(u)),
        setThingPartialState: (t, s) => dispatch(connectionActions.setThingPartialState(t, s)),
    };
}

type PropsType = {
};

type StateType = {
    /**
     * 0: display logo and -> Demo button
     * 1: display logo and -> Demo loading
     * 2: animating towards faded logo and button
     * 3: display tablet controls (fades in)
     */
    currentStage: number,
};

class RoomDemoComponent extends React.Component<PropsType, StateType> {
    state = {
        currentStage: 0,
    }

    _logo = require('../../assets/images/verboze.png');

    createWebsocketURL(token: string): string {
        return "ws://" + location.host + "/stream/" + token + '/';
    }

    componentWillMount() {
        /* bind websocket callbacks */
        WebSocketCommunication.setOnConnected(this.onConnected.bind(this));
        WebSocketCommunication.setOnDisconnected(this.onDisconnected.bind(this));
        WebSocketCommunication.setOnMessage(this.onMessage.bind(this));
    }

    componentWillUnmount() {
        WebSocketCommunication.disconnect();
    }

    /* websocket callback on connect event */
    onConnected() : any {
        this.setState({currentStage: 2});
        setTimeout((() => this.setState({currentStage: 3})).bind(this), 1000);
    }

    /* websocket callback on disconnect event */
    onDisconnected() : any {
        const { setConfig } = this.props;
        this.setState({currentStage: 0});
    }

    /* websocket callback on message event */
    onMessage(data: ConnectionTypes.WebSocketDataType) : any {
        const { setThingPartialState } = this.props;
        const { store } = this.context;
        const reduxState = store.getState();

        if ("code" in data && data.code === 0) {
            // phone app sent code 0, reply with config!
            WebSocketCommunication.sendMessage({
                config: reduxState.connection.roomConfig,
                ...reduxState.connection.roomState,
            })
        } else {
            // we have a command
            var keys = Object.keys(data);
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] !== 'config' && keys[i] !== 'token') {
                    console.log(keys[i], "===>", data[keys[i]]);
                    setThingPartialState(keys[i], data[keys[i]]);
                }
            }
        }
    }

    startDemo() {
        const { setConnectionURL } = this.props;

        if (this.state.currentStage === 0) {
            this.setState({currentStage: 1});
            APICaller.createToken(((token: APITypes.CreatedToken) => {
                setConnectionURL(this.createWebsocketURL(token.id));
                WebSocketCommunication.connect(this.createWebsocketURL(token.id));
            }).bind(this));
        }
    }

    renderLogo() {
        const { currentStage } = this.state;

        var loading_status = currentStage > 0 ? {loading: true} : {};

        return (
            <div style={styles.roomContainer}>
                <div style={currentStage > 1 ? styles.logo_container_faded : styles.logo_container}>
                    <img style={styles.logo} src={this._logo} />
                    <Button {...loading_status} primary fade='true' vertical='true' size='massive' onClick={this.startDemo.bind(this)}>
                        {"Try demo!"}
                    </Button>
                </div>
            </div>
        );
    }

    renderDemo() {
        return (
            <div style={styles.roomContainer}>
                <RoomState />
                <RoomDemoControls />
            </div>
        );
    }

    render() {
        const { currentStage } = this.state;

        switch (currentStage) {
            case 0:
            case 1:
            case 2:
                return this.renderLogo();
            case 3:
                return this.renderDemo();
        }
    }
};
RoomDemoComponent.contextTypes = {
    store: PropTypes.object
};

const styles = {
    roomContainer: {
        height: 700,

        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#111111',
    },
    logo_container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        marginTop: 0,
        opacity: 1,
    },
    logo_container_faded: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        marginTop: -500,
        opacity: 0,
        transition: 'margin-top 1s, opacity 500ms',
    },
    logo: {
        width: 666,
        height: 400,
    },
};


module.exports = { RoomDemoComponent: ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomDemoComponent) };
