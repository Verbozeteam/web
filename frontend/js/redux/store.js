/* @flow */

import * as React from 'react';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

const ConnectionReducer = require('./reducers/connection');
const ThingsReducer = require('./reducers/things');

export const STORE = createStore(combineReducers({
  connection: ConnectionReducer,
  things: ThingsReducer,
}));

export function AppWrapper(ChildView: any) {
  return class extends React.Component<any, any> {
    render() {
      return (
        <Provider store={STORE}>
          <ChildView />
        </Provider>
      );
    }
  }
};
