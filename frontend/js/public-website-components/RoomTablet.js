/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

type PropsType = {
};

type StateType = {
};

class RoomTabletBase extends React.Component<PropsType, StateType> {
    render() {
        return (
            <div style={styles.tabletContainer}>
            </div>
        );
    }
};
RoomTabletBase.contextTypes = {
    store: PropTypes.object
};

const styles = {
    tabletContainer: {
        height: 300,
        width: 500,
        backgroundColor: 'black',
        borderRadius: 10,
        position: 'absolute',
        right: 100,
        border: '1px solid white',
    },
};

export const RoomTablet = RoomTabletBase;
