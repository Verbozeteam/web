/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { connect as ReduxConnect } from 'react-redux';
import * as UIStateActions from '../redux/actions/uistate';

import * as APITypes from '../api-utils/APITypes';

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

class RoomFullViewBase extends React.Component<PropsType, StateType> {
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
                </div>
            </div>
        );
    }
};
RoomFullViewBase.contextTypes = {
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
        height: 60,
        fontSize: 30,
    },
    cancelButtonContainer: {
        float: 'right',
        height: 60,
        width: 60,
        padding: 2,
        resize: 'fit',
        backgroundColor: 'black',
    },
    innerContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },
};



export const RoomFullView = ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomFullViewBase);
