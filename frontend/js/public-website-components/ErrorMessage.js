/* @flow */

import React, { Component } from 'react';

import {
    Message
} from 'semantic-ui-react';

type PropsType = {
    errorHeader: string,
    errorMessage: string
};

type StateType = {};


export default class ErrorMessage extends Component<PropsType, StateType> {
    static defaultProps = {
        errorHeader: 'Oops!',
        errorMessage: 'Something went wrong. Please try again.'
    };

    render() {
        return (
            <Message negative>
              <Message.Header>{ this.props.errorHeader }</Message.Header>
              <p>{ this.props.errorMessage }</p>
            </Message>
        )
    }
}