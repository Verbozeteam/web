/* @flow */

import React, { Component } from 'react';

import { Link } from 'react-router-dom';

type PropsType = {
};

type StateType = {
};

export default class Company extends Component<PropsType, StateType> {

    render() {
        return (
            <div style={styles.companyDiv}>
            	<br/>
            	<br/>
            	<br/>
            	<br/>
                COMPANY PAGE
            </div>
        );
    };
};


const styles = {
	companyDiv: {
		height: '100vh',
		background: 'black',
		color: 'white',
	}
};