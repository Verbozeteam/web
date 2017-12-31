/* @flow */

import * as React from 'react';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

const ConnectionReducer = require('./reducers/connection');
const UIStateReducer = require('./reducers/uistate');

export const STORE = createStore(combineReducers({
    connection: ConnectionReducer,
    uistate: UIStateReducer,
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
