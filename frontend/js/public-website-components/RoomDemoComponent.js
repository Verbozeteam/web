/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { RoomDemoControls } from './RoomDemoControls';

type PropsType = {
};

type StateType = {
};

class RoomDemoComponentBase extends React.Component<PropsType, StateType> {
    render() {
        return (
            <div style={styles.roomContainer}>

                <RoomDemoControls />
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
        backgroundColor: 'black',
    },
};

export const RoomDemoComponent = RoomDemoComponentBase;
