/* @flow */

import * as APITypes from '../../../js-api-utils/APITypes';
import * as ConnectionTypes from '../../../js-api-utils/ConnectionTypes';
import type { GroupType } from '../../../js-api-utils/ConfigManager';

export const SET_CONNECTION_STATE = 'SET_CONNECTION_STATE';
export const SET_ROOMS = 'SET_ROOMS';
export const SET_ROOMS_GROUPS = 'SET_ROOMS_GROUPS';
export const SET_ROOM_CONFIG = 'SET_ROOM_CONFIG';
export const SET_ROOM_ORDERS = 'SET_ROOM_ORDERS';

export const SET_ROOM_THING_STATE = 'SET_ROOM_THING_STATE';
export const SET_ROOM_THINGS_STATES = 'SET_ROOM_THINGS_STATES';
export const SET_ROOM_THING_PARTIAL_STATE = 'SET_ROOM_THING_PARTIAL_STATE';
export const SET_ROOM_THINGS_PARTIAL_STATES = 'SET_ROOM_THINGS_PARTIAL_STATES';

export function setConnectionState(connection_state: number) {
    return {
        type: SET_CONNECTION_STATE,
        connection_state
    };
};

export function setRooms(rooms: Array<APITypes.Room>) {
    return {
        type: SET_ROOMS,
        rooms,
    };
};

export function setRoomsGroups(roomsGroups: {[roomId: string]: Array<GroupType>}) {
    return {
        type: SET_ROOMS_GROUPS,
        roomsGroups,
    };
};

export function setRoomConfig(roomId: string, config: ConnectionTypes.ConfigType) {
    return {
        type: SET_ROOM_CONFIG,
        roomId,
        config,
    };
}

export function setRoomOrders(roomId: string, orders: Array<OrderType>) {
    return {
        type: SET_ROOM_ORDERS,
        roomId,
        orders
    };
}

export function setRoomThingsStates(roomId: string, thingToState: Object) {
    return {
        type: SET_ROOM_THINGS_STATES,
        roomId,
        thingToState,
    }
}

export function setRoomThingState(roomId: string, thingId: string, state: Object) {
    return {
        type: SET_ROOM_THING_STATE,
        roomId,
        thingId,
        state,
    }
}

export function setRoomThingPartialState(roomId: string, thingId: string, state: Object) {
    return {
        type: SET_ROOM_THING_PARTIAL_STATE,
        roomId,
        thingId,
        state,
    }
}

export function setRoomThingsPartialStates(roomId: string, thingToPartialState: Object) {
    return {
        type: SET_ROOM_THINGS_PARTIAL_STATES,
        roomId,
        thingToPartialState,
    }
}
