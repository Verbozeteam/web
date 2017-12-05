/* @flow */

import { SET_CONNECTION_STATE, SET_ROOMS } from '../actions/connection';
import * as APITypes from '../../api-utils/APITypes';

type StateType = {
    connection_state: 0 | 1 | 2,
    rooms: Array<APITypes.Room>,
};

const defaultState: StateType = {
    /* 0 - not connected, 1 - connecting, 2 - connected */
    connection_state: 0,
    rooms: [],
};

module.exports = (state: StateType = defaultState, action: Object) => {
    var new_state: StateType = JSON.parse(JSON.stringify(state));

    switch(action.type) {
        /* set WebSocket connection state */
        case SET_CONNECTION_STATE:
            new_state.connection_state = action.connection_state;
            break;

        /* sets config */
        case SET_ROOMS:
            new_state.rooms = action.rooms;
            break;
    }

    return new_state;
}
