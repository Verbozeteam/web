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

import { RoomDemoControls } from './RoomDemoControls';
import { RoomState } from './room-state/RoomState';

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setToken: t => dispatch(tabletActions.setCurrentConnectionToken(t)),
    };
}

type PropsType = {
};

type StateType = {
    /**
     * 0: display logo and -> Demo button
     * 1: display logo and -> Demo loading
     * 2:
     */
    currentStage: number,
};

class RoomDemoComponent extends React.Component<PropsType, StateType> {
    state = {
        currentStage: 0,
    }

    _logo = require('../../assets/images/verboze.png');

    startDemo() {
        const { setToken } = this.props;

        if (this.state.currentStage === 0) {
            this.setState({currentStage: 1});
            APICaller.createToken((token: APITypes.CreatedToken) => {
                setToken(token);
                console.log("habbetein")
            });
        }
    }

    renderLogo() {
        const { currentStage } = this.state;

        var loading_status = currentStage === 1 ? {loading: true} : {};

        return (
            <div style={styles.roomContainer}>
                <img style={styles.logo} src={this._logo} />
                <Button {...loading_status} primary fade='true' vertical='true' size='massive' onClick={this.startDemo.bind(this)}>
                    {"Try demo!"}
                </Button>
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
                return this.renderLogo();
            case 2:
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

        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 666,
        height: 400,
    },
};


module.exports = { RoomDemoComponent: ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomDemoComponent) };
