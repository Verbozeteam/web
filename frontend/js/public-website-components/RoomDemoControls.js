/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { RoomTablet } from './RoomTablet';

type PropsType = {
};

type StateType = {
};

class RoomDemoControlsBase extends React.Component<PropsType, StateType> {
    render() {
        return (
            <div style={styles.controlsContainer}>
                <RoomTablet />
            </div>
        );
    }
};
RoomDemoControlsBase.contextTypes = {
    store: PropTypes.object
};

const styles = {
    controlsContainer: {
        position: 'absolute',
        height: 300,
        width: '100%',
        bottom: -80,
    },
};

export const RoomDemoControls = RoomDemoControlsBase;
