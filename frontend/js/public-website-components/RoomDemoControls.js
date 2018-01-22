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
        setTimeout((() => {
            if (!this.state.isRendered)
                this.setState({isRendered: true})
        }).bind(this), 100)
    }

    render() {
        const { dimensions } = this.props;
        const { curPage } = this.state;

        var style = {...styles.controlsContainer, ...{top: dimensions.height-300 - 10, left: dimensions.width/2-350}};

        if (!this.state.isRendered) {
            style.opacity = 0;
            style.top = dimensions.height;
            requestAnimationFrame(this.animate.bind(this));
        }

        var contents = null;
        if (curPage === 0) {
            contents = (
                <div style={styles.phone_instructions}>
                    <div style={styles.header}>Get the App</div>
                    <img src={require('../../assets/images/play_store.png')} style={styles.store_icon} />
                    <img src={require('../../assets/images/app_store.png')} style={styles.store_icon} />

                    {/*<Button primary fade='true' vertical='true' size='small' style={styles.button} onClick={(() => this.setState({curPage: 1})).bind(this)}>
                        {"Use the app"}
                    </Button>*/}
                </div>
            );
        } else if (curPage === 1) {
            contents = (
                <div style={styles.phone_instructions}>
                    <div style={styles.header}>Scan this code</div>
                    <div style={styles.qr_code}>
                        <QRCode value={this.props.connectionURL} size={105} />
                    </div>
                </div>
            );
        }

        return (
            <div style={style}>
                {contents}
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
        position: 'absolute',
        height: 300,
        width: 700,
        opacity: 1,
        transition: 'opacity 500ms, top 500ms',
        display: 'flex',
        flexDirection: 'row',
    },
    phone_instructions: {
        backgroundImage: 'url(' + require('../../assets/images/iphone_black.png') + ')',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

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
    },
};

module.exports = { RoomDemoControls: ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomDemoControls) };
