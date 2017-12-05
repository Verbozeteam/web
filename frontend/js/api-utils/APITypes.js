// @flow

export type ErrorType = Object;

export type RequestMethod = 'get' | 'put' | 'post' | 'patch' | 'head' | 'options' | 'delete';

export type Room = {
    id: string,
    name: string,
    floor?: string,
};
