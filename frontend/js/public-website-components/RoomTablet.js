/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { RoomStacks } from './tablet-components/RoomStacks';

type PropsType = {
};

type StateType = {
};

class RoomTablet extends React.Component<PropsType, StateType> {
    render() {
        return (
            <div style={styles.tabletContainer}>
                <div style={styles.bezel}>
                    <RoomStacks width={styles.bezel.width} height={styles.bezel.height} />
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
        //border: '1px solid white',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    bezel: {
        top: 10,
        left: 10,
        position: 'absolute',
        width: 480,
        height: 280,
        backgroundColor: '#111111',
        display: "flex",
        flexDirection: 'column',
        cursor: 'pointer',
    },
};

module.exports = { RoomTablet };
