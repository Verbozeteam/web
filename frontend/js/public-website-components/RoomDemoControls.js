/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';

const QRCode = require('qrcode.react');

import { SquareButton } from './SquareButton';
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
    dimensions: {width: number, height: number},
};

type StateType = {
    isRendered: boolean,
    curPage: number, // 0 is "get app" page, 1 is "scan QR" page
};

class RoomDemoControls extends React.Component<PropsType, StateType> {
    state = {
        isRendered: false,
        curPage: 0,
    };

    animate() {
        if (!this.state.isRendered)
            this.setState({isRendered: true});
    }

    render() {
        const { dimensions } = this.props;
        const { curPage, isRendered } = this.state;

        var isOnPhone = dimensions.width <= 992;

        if (!isRendered) {
            requestAnimationFrame(this.animate.bind(this));
        }

        var contents = null;
        if (!isOnPhone) {
            if (curPage === 0) {
                contents = (
                    <div style={styles.phone_instructions}>
                        <div style={styles.header}>Get the App</div>
                        <img src={require('../../assets/images/play_store.png')} style={styles.store_icon} />
                        <img src={require('../../assets/images/app_store.png')} style={styles.store_icon} />

                        <SquareButton onClick={(() => this.setState({curPage: 1})).bind(this)} extraStyle={styles.button}>
                            Use the App
                        </SquareButton>
                    </div>
                );
            } else if (curPage === 1) {
                contents = (
                    <div style={styles.phone_instructions}>
                        <div style={styles.header}>Scan this code</div>
                        <div style={styles.qr_code}>
                            <QRCode value={this.props.connectionURL} size={105} />
                        </div>

                        <SquareButton onClick={(() => this.setState({curPage: 0})).bind(this)} extraStyle={styles.button}>
                            Get the App
                        </SquareButton>
                    </div>
                );
            }
        } else {
            contents = (
                <div style={styles.phoneText}>
                    {"View this page on a browser to interact with the room"}
                </div>
            );
        }

        return (
            <div style={{...styles.controlsContainer, opacity: isRendered ? 1 : 0}}>
                <div style={styles.content}>
                    {contents}
                    {!isOnPhone ? <RoomTablet /> : null}
                </div>
            </div>
        );
    }
};
RoomDemoControls.contextTypes = {
    store: PropTypes.object
};

const styles = {
    controlsContainer: {
        position: 'relative',
        height: '100%',
        width: '100%',
        transition: 'opacity 500ms',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    content: {
        position: 'absolute',
        bottom: 5,
        display: 'flex',
        flexDirection: 'row',
    },
    phone_instructions: {
        backgroundImage: 'url(' + require('../../assets/images/iphone_black.png') + ')',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontWeight: 'lighter',

        width: 200,
        height: 300,

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        position: 'absolute',
        margin: 0,
        top: 46,
        fontSize: 18,
        height: 25,
        color: '#ffffff',
    },
    qr_code: {
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        backgroundColor: '#FFFFFF',
    },
    app_instructions: {
        width: 250,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
    },
    store_icon: {
        width: 120,
        height: 42,
    },
    button: {
        position: 'absolute',
        margin: 0,
        bottom: 46,
        height: 30,
        width: 110,
        fontSize: 14,
        padding: 4,
    },
    phoneText: {
        padding: 10,
        paddingBottom: 50,
        fontWeight: 'lighter',
        fontSize: 24,
        color: '#ffffff',
        textAlign: 'center',
    },
};

module.exports = { RoomDemoControls: ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomDemoControls) };
