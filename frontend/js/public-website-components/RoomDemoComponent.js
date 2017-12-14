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
    setConnectionURL: (string) => null,
    setThingPartialState: (string, Object) => null,
};

type StateType = {
    /**
     * 0: display logo and -> Demo button
     * 1: display logo and -> Demo loading
     * 2: animating towards faded logo and button
     * 3: display tablet controls
     */
    currentStage: number,
};

class RoomDemoComponent extends React.Component<PropsType, StateType> {
    state = {
        currentStage: 0,
    };

    _isUnmounting = false;

    _logo = require('../../assets/images/verboze_logo_white.png');

    createWebsocketURL(token: string): string {
        return "ws://" + location.host + "/stream/" + token + '/';
    }

    componentWillMount() {
        this._isUnmounting = false;

        /* bind websocket callbacks */
        WebSocketCommunication.setOnConnected(this.onConnected.bind(this));
        WebSocketCommunication.setOnDisconnected(this.onDisconnected.bind(this));
        WebSocketCommunication.setOnMessage(this.onMessage.bind(this));
    }

    componentWillUnmount() {
        this._isUnmounting = true;
        WebSocketCommunication.disconnect();
    }

    /* websocket callback on connect event */
    onConnected() : any {
        this.setState({currentStage: 2});
        setTimeout((() => this.setState({currentStage: 3})).bind(this), 1000);
    }

    /* websocket callback on disconnect event */
    onDisconnected() : any {
        if (!this._isUnmounting)
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
            });
        } else if ("thing" in data) {
            // we have a command
            var thing_id = data.thing;
            delete data.thing;
            setThingPartialState(thing_id, data);
        }
    }

    startDemo() {
        const { setConnectionURL } = this.props;

        if (this.state.currentStage === 0) {
            this.setState({currentStage: 1});
            APICaller.createToken(((token: APITypes.CreatedToken) => {
                setConnectionURL(this.createWebsocketURL(token.id));
                WebSocketCommunication.connect(this.createWebsocketURL(token.id));
            }).bind(this), ((error: APITypes.ErrorType) => {
                this.setState({currentStage: 0});
            }).bind(this));
        }
    }

    renderLogo() {
        const { currentStage } = this.state;

        var loading_status = currentStage > 0 ? {loading: true} : {};

        return (
            <div style={styles.roomContainer}>
                <div style={styles.logoStaticContainer}>
                    <div style={currentStage > 1 ? styles.logoContainerFaded : styles.logoContainer}>
                        <img style={styles.logo} src={this._logo} />
                    </div>
                </div>
                <div style={styles.whitePad} />
            </div>
        );
    }

    renderDemo() {
        return (
            <div style={styles.roomContainer}>
                <RoomState />
                <div style={styles.whitePad} />
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
        height: 800,

        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1b1c1d',


        MozUserSelect: '-moz-none',
        KhtmlUserSelect: 'none',
        UebkitUserSelect: 'none',
        MsUserSelect: 'none',
        userSelect: 'none',
    },
    logoStaticContainer: {
        height: 700,
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        marginTop: 0,
        opacity: 1,
    },
    logoContainerFaded: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        marginTop: -500,
        opacity: 0,
        transition: 'margin-top 1s, opacity 500ms',
    },
    logo: {
        height: 400,
    },
    whitePad: {
        position: 'relative',
        bottom: 0,
        height: 100,
        width: '100%',
        backgroundColor: '#ffffff',
    }
};


module.exports = { RoomDemoComponent: ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomDemoComponent) };
