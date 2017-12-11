/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import * as connectionActions from '../redux/actions/connection';

type PropsType = {
};

type StateType = {
};

class RoomGrid extends React.Component<PropsType, StateType> {
    render() {
        return (
            <div style={styles.container} onClick={
                (() => {
                    this.context.store.dispatch(connectionActions.setThingPartialState("lightswitch-1", {"intensity": 1}));
                }).bind(this)
            }>
            </div>
        );
    }
}
RoomGrid.contextTypes = {
    store: PropTypes.object
};

const styles = {
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
    },
};

module.exports = { RoomGrid };
