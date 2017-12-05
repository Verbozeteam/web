/* @flow */

export const SET_CONNECTION_STATE = 'SET_CONNECTION_STATE';
export const SET_CONFIG = 'SET_CONFIG';

/* set WebSocket connection state */
export function setConnectionState(connection_state: number) {
  return {
    type: SET_CONNECTION_STATE,
    connection_state
  };
};

/* sets config */
export function setConfig(config: Object) {
  return {
    type: SET_CONFIG,
    config
  };
};
