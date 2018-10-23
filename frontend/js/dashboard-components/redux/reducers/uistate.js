/* @flow */

import { SET_CURRENT_ROOM } from '../actions/uistate';

type StateType = {
    selectedRoomId: string,
};

const defaultState: StateType = {
    selectedRoomId: '',
};

module.exports = (state: StateType = defaultState, action: Object) => {
    var new_state: StateType = JSON.parse(JSON.stringify(state));

    switch(action.type) {
        /* set WebSocket connection state */
        case SET_CURRENT_ROOM:
            new_state.selectedRoomId = action.room_index;
            break;
    }

    return new_state;
}
