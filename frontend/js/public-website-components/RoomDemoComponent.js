/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

type PropsType = {
};

type StateType = {
};

class RoomDemoComponentBase extends React.Component<PropsType, StateType> {
    render() {
        const { room } = this.props;

        return (
            <div style={styles.roomContainer}>
            </div>
        );
    }
};
RoomDemoComponentBase.contextTypes = {
    store: PropTypes.object
};

const styles = {
    roomContainer: {
        height: 700,

        display: 'flex',
        flexDirection: 'column',
    },
};

export const RoomDemoComponent = RoomDemoComponentBase;
