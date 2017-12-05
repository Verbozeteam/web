/* @flow */

export const SET_THING_STATE = 'SET_THING_STATE';
export const SET_THINGS_STATES = 'SET_THINGS_STATES';
export const SET_THING_PARTIAL_STATE = 'SET_THING_PARTIAL_STATE';
export const SET_THINGS_PARTIAL_STATES = 'SET_THINGS_PARTIAL_STATES';

export function set_things_states(thing_to_state: Object) {
    return {
        type: SET_THINGS_STATES,
        thingsToStates: thing_to_state,
    }
}

export function set_thing_state(id: string, state: Object) {
    return {
        type: SET_THING_STATE,
        thingId: id,
        state: state,
    }
}

export function set_thing_partial_state(id: string, state: Object) {
    return {
        type: SET_THING_PARTIAL_STATE,
        thingId: id,
        state: state,
    }
}

export function set_things_partial_states(thing_to_partial_state: Object) {
    return {
        type: SET_THINGS_PARTIAL_STATES,
        thingsToPartialStates: thing_to_partial_state,
    }
}
