/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { connect as ReduxConnect } from 'react-redux';

function mapStateToProps(state) {
    return {
        roomState: state.connection.roomState,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

type PropsType = {
    roomState: Object,
};

type StateType = {
};

class RoomState extends React.Component<PropsType, StateType> {
    render() {
        const { roomState } = this.props;

        return (
            <div style={styles.container}>
                {JSON.stringify(roomState)}
            </div>
        );
    }
}
RoomState.contextTypes = {
    store: PropTypes.object
};

const styles = {
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        color: 'red',
    },
};

module.exports = { RoomState: ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomState) };
