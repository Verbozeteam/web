/* @flow */

import { SET_CONNECTION_STATE,
         SET_CONFIG }
         from '../actions/connection';

type StateType = {
  connection_state: 0 | 1 | 2,
  config: Object
}

const defaultState: StateType = {
  /* 0 - not connected, 1 - connecting, 2 - connected */
  connection_state: 0,
  config: {}
};

module.exports = (state: StateType = defaultState, action: Object) => {
  var new_state: StateType = {...state};

  switch(action.type) {
    /* set WebSocket connection state */
    case SET_CONNECTION_STATE:
      new_state.connection_state = action.connection_state;
      break;

    /* sets config */
    case SET_CONFIG:
      new_state.config = action.config;
      break;
  }

  return new_state;
}
