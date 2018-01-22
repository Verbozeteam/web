/* @flow */

import React, { Component } from 'react';

import { Link } from 'react-router-dom';

type PropsType = {
};

type StateType = {
    width: number,
    height: number,
};

export default class Company extends Component<PropsType, StateType> {

    constructor(props: PropsType) {
        super(props);
        this.state = { width: 0, height: 0 };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {

        // var divHeight = document.getElementById("myDiv").offsetHeight;
        // if (this.state.height < window.innerHeight) {

        // }
        // height: this.state.height, width: this.state.width,
        return (
            <div style={{...styles.companyDiv}}>
            	<br/>
            	<br/>
            	<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

            	<br/>
                COMPANY PAGE
            </div>
        );
    };
};


const styles = {
	companyDiv: {
		background: 'grey',
		color: 'white',
	}
};