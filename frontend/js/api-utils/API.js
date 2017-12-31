/* @flow */

import axios from 'axios';

import * as APITypes from './APITypes';

export class APICallerClass {
    __extraHeaders : {[string]: string} = {
        authorization: 'token 89640ba943f949a7c766defff8b315263a62efae',
        'X-CSRFToken': '',
    };

    __makeRequest(
        requestMethod: APITypes.RequestMethod,
        endpoint: string,
        params: Object,
        success: (any) => any,
        failure?: (APITypes.ErrorType) => any) {

        if (params.headers === undefined)
            params.headers = {};
        params.headers = {...params.headers, ...this.__extraHeaders};

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

    setCSRFToken (token: string) {
        this.__extraHeaders['X-CSRFToken'] = token;
    }
};
