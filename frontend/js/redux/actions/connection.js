/* @flow */

import * as APITypes from '../../api-utils/APITypes';

export const SET_CONNECTION_STATE = 'SET_CONNECTION_STATE';
export const SET_ROOMS = 'SET_ROOMS';

/* set WebSocket connection state */
export function setConnectionState(connection_state: number) {
  return {
    type: SET_CONNECTION_STATE,
    connection_state
  };
};

/* sets config */
export function setRooms(rooms: Array<APITypes.Room>) {
  return {
    type: SET_ROOMS,
    rooms,
  };
};
