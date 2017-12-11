/* @flow */

import axios from 'axios';

import * as APITypes from './APITypes';

class APICallerClass {
    __makeRequest(
        requestMethod: APITypes.RequestMethod,
        endpoint: string,
        params: Object,
        success: (any) => any,
        failure?: (APITypes.ErrorType) => any) {

        if (params.headers === undefined)
            params.headers = {};
        params.headers['authorization'] = 'token 89640ba943f949a7c766defff8b315263a62efae';

        axios({
            method: requestMethod,
            url: endpoint,
            ...params,
        }).then((ret: Object) => {
            success(ret.data);
        }).catch((err: APITypes.ErrorType) => {
            if (failure)
                failure(err);
        });
    }

    getRooms(success: (Array<APITypes.Room>) => any, failure?: (APITypes.ErrorType) => any) {
        this.__makeRequest('get', '/api/rooms/', {}, success, failure);
    }

    createToken(success: (APITypes.CreatedToken) => any, failure?: (APITypes.ErrorType) => any) {
        this.__makeRequest('post', '/api/tokens/', {}, success, failure);
    }
};

export const APICaller = new APICallerClass();
