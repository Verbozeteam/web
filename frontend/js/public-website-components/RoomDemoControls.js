/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

const QRCode = require('qrcode.react');

import { RoomTablet } from './RoomTablet';

function mapStateToProps(state) {
    return {
        connectionURL: state.tabletstate.connectionURL,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

type PropsType = {
    connectionURL: string,
};

type StateType = {
    isRendered: boolean,
};

class RoomDemoControls extends React.Component<PropsType, StateType> {
    state = {
        isRendered: false,
    };

    animate() {
        setTimeout((() => {
            if (!this.state.isRendered)
                this.setState({isRendered: true})
        }).bind(this), 100)
    }

    render() {
        var style = {...styles.controlsContainer};

        if (!this.state.isRendered) {
            style.opacity = 0;
            style.top = 800;
            requestAnimationFrame(this.animate.bind(this));
        }

        return (
            <div style={style}>
                <div style={styles.qr_code}>
                    <QRCode value={this.props.connectionURL} />
                </div>
                <RoomTablet />
            </div>
        );
    }
};
RoomDemoControls.contextTypes = {
    store: PropTypes.object
};

const styles = {
    controlsContainer: {
        top: 550,
        position: 'absolute',
        height: 300,
        width: '100%',
        opacity: 1,
        transition: 'opacity 500ms, top 500ms',
    },
    qr_code: {
        position: 'absolute',
        left: 50,
        bottom: 0,
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        backgroundColor: '#FFFFFF',
    }
};

module.exports = { RoomDemoControls: ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomDemoControls) };

