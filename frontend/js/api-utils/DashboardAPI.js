/* @flow */

import { APICallerClass } from './API';

import * as APITypes from './APITypes';

class DashboardAPICallerClass extends APICallerClass {
    getRooms(success: (Array<APITypes.Room>) => any, failure?: (APITypes.ErrorType) => any) {
        this.__makeRequest('get', '/api/rooms/', {}, success, failure);
    }
}

export const DashboardAPICaller = new DashboardAPICallerClass();
