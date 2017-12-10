/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { connect as ReduxConnect } from 'react-redux';
import * as UIStateActions from '../redux/actions/uistate';

import * as APITypes from '../api-utils/APITypes';
import * as ConnectionTypes from '../api-utils/ConnectionTypes';

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
    ...any,
};

type StateType = {
};

class RoomWindowBase extends React.Component<PropsType, StateType> {
    _close_button = require('../../assets/images/close.png');

    onClose() {
        this.props.setCurrentRoom("");
    }

    render() {
        const { room } = this.props;

        return (
            <div style={styles.roomContainer}>
                <div style={styles.header}>
                    {room.name}
                    <div style={styles.cancelButtonContainer}
                        onClick={this.onClose.bind(this)}>
                        <img src={this._close_button} />
                    </div>
                </div>
                <div style={styles.innerContainer}>
                    <RoomView room={room} isSummary={false}/>
                </div>
            </div>
        );
    }
};
RoomWindowBase.contextTypes = {
    store: PropTypes.object
};

const styles = {
    roomContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        margin: 20,
    },
    header: {
        height: 40,
        fontSize: 30,
        borderRadius: 20,
        backgroundColor: '#eeeeee',
        padding: 10,
    },
    cancelButtonContainer: {
        float: 'right',
        height: 60,
        width: 60,
        resize: 'fit',
    },
    innerContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        padding: 20,
    },
};



export const RoomWindow = ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomWindowBase);
