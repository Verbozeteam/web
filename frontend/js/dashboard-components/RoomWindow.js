/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import * as Styles from '../constants/Styles';

import { connect as ReduxConnect } from 'react-redux';
import * as UIStateActions from './redux/actions/uistate';

import * as APITypes from '../js-api-utils/APITypes';

import { RoomView } from './RoomView';

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        setCurrentRoom: (rid: string) => dispatch(UIStateActions.setCurrentRoom(rid)),
    };
}

type PropsType = {
    room: APITypes.Room,
    setCurrentRoom: (roomId: string) => {}
};

type StateType = {
};

class RoomWindowBase extends React.Component<PropsType, StateType> {
    _close_button = require('../../assets/dashboard_images/cross.png');

    onClose() {
        this.props.setCurrentRoom("");
    }

    render() {
        const { room } = this.props

        return (
            <div style={ styles.roomContainer }>
                <span style={ styles.roomName }>Room #{ room.name }</span>
                <div className={ 'float-right container' } style={ styles.closeButtonContainer } onClick={this.onClose.bind(this)}>
                    <button style={styles.closeButton}>
                        <img src={this._close_button} /> Close
                    </button>
                </div>
                <div style={ styles.guestName }>Yahya Alhomsi</div>
                <RoomView room={room} isSummary={false} />
            </div>
        );
    }
};
RoomWindowBase.contextTypes = {
    store: PropTypes.object
};

const styles = {
    roomContainer: {
        height: '100%',
        borderRadius: '5px',
        backgroundColor: Styles.Colors.dark_gray,
        borderBottom: '4px solid',
        borderBottomColor: Styles.Colors.red,
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.25)',
        padding: 40,
        overflowY: 'scroll'
    },
    roomName: {
        color: Styles.Colors.white,
        fontSize: 32,
        fontWeight: 500,
        fontStyle: 'normal',
        fontStretch: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
    },
    guestName: {
        fontSize: 26,
        fontWeight: 500,
        fontStyle: 'italic',
        fontStretch: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: Styles.Colors.light_gray,
        paddingTop: 15
    },
    closeButtonContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: 154,
        height: 35,
        borderRadius: 3,
        backgroundColor: Styles.Colors.background_close_button,
        padding: 0,
    },
    closeButton: {
        background: 'none',
        color: Styles.Colors.red,
        height: 35,
        fontSize: 18,
        fontWeight: 500,
        borderRadius: 3,
        border: 'none'
    }


};



export const RoomWindow = ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomWindowBase);
