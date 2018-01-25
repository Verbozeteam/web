/* @flow */

import React, { Component } from 'react';

import PageTopBanner from './PageTopBanner';

import { Link } from 'react-router-dom';

type PropsType = {
};

type StateType = {
    width: number,
    height: number,
};

export default class Company extends Component<PropsType, StateType> {
    _banner_img = require('../../assets/images/page_top_banners/banner.png');

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
            	<PageTopBanner title="We will empower hotels to do what they do best, but even better" imageUrl={ this._banner_img } />
            </div>
        );
    };
};


const styles = {
	companyDiv: {
        height: '100vh',
		background: 'grey',
		color: 'white',
	}
};