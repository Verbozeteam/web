/* @flow */

import React, { Component } from 'react';
import {
    Header,
} from 'semantic-ui-react';

type PropsType = {
};

type StateType = {
};

export default class Features extends Component<PropsType, StateType> {
	render() {
		return (
			<div>
                <Header as='h3' style={{ fontSize: '2em' }}>THIS IS FEATURES PAGE!</Header>
            </div>
		);
	};
};
