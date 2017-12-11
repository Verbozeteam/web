/* @flow */

import {
    SET_CURRENT_PANEL,
    SET_CURRENT_CONNECTION_TOKEN,
} from '../actions/tabletstate';

type StateType = {
    selectedPanel: number,
    connectionToken: string,
};

const defaultState: StateType = {
    selectedPanel: -1,
    connectionToken: "",
};

module.exports = (state: StateType = defaultState, action: Object) => {
    var new_state: StateType = JSON.parse(JSON.stringify(state));

    switch(action.type) {
        /* set WebSocket connection state */
        case SET_CURRENT_PANEL:
            new_state.selectedPanel = action.panel_index;
            break;
        case SET_CURRENT_CONNECTION_TOKEN:
            new_state.connectionToken = action.token;
            break;
    }

    return new_state;
}
