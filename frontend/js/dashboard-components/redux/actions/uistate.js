/* @flow */

export const SET_CURRENT_ROOM = 'SET_CURRENT_ROOM';

export function setCurrentRoom(room_index: string) {
  return {
    type: SET_CURRENT_ROOM,
    room_index
  };
};

