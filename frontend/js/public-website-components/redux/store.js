/* @flow */

import * as React from 'react';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

const ConnectionReducer = require('./reducers/connection');
const TabletStateReducer = require('./reducers/tabletstate');

export const STORE = createStore(combineReducers({
    connection: ConnectionReducer,
    tabletstate: TabletStateReducer,
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
