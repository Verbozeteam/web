/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { RoomGrid } from './tablet-components/RoomGrid';

type PropsType = {
};

type StateType = {
};

class RoomTablet extends React.Component<PropsType, StateType> {
    render() {
        return (
            <div style={styles.tabletContainer}>
                <div style={styles.bezel}>
                    <RoomGrid width={styles.bezel.width} height={styles.bezel.height} />
                </div>
            </div>
        );
    }
};
RoomTablet.contextTypes = {
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    bezel: {
        top: 20,
        left: 20,
        position: 'absolute',
        width: 460,
        height: 260,
        backgroundColor: '#111111',
        display: "flex",
        flexDirection: 'column',
    },
};

module.exports = { RoomTablet };
