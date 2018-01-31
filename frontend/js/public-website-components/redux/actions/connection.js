/* @flow */

import * as APITypes from '../../../js-api-utils/APITypes';
import * as ConnectionTypes from '../../../js-api-utils/ConnectionTypes';

export const SET_CONNECTION_STATE = 'SET_CONNECTION_STATE';

export const SET_THING_STATE = 'SET_THING_STATE';
export const SET_THINGS_STATES = 'SET_THINGS_STATES';
export const SET_THING_PARTIAL_STATE = 'SET_THING_PARTIAL_STATE';
export const SET_THINGS_PARTIAL_STATES = 'SET_THINGS_PARTIAL_STATES';

export function setConnectionState(connection_state: number) {
    return {
        type: SET_CONNECTION_STATE,
        connection_state
    };
};

export function setThingsStates(thingToState: Object) {
    return {
        type: SET_THINGS_STATES,
        thingToState,
    }
}

export function setThingState(thingId: string, state: Object) {
    return {
        type: SET_THING_STATE,
        thingId,
        state,
    }
}

export function setThingPartialState(thingId: string, state: Object) {
    return {
        type: SET_THING_PARTIAL_STATE,
        thingId,
        state,
    }
}

export function setThingsPartialStates(thingToPartialState: Object) {
    return {
        type: SET_THINGS_PARTIAL_STATES,
        thingToPartialState,
    }
}