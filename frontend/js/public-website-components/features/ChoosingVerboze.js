/* @flow */

import React, { Component } from 'react';

import PageTopBanner from '../PageTopBanner';

type PropsType = {};

type StateType = {};


export default class ChoosingVerboze extends Component<PropsType, StateType> {
	_banner_img = require('../../../assets/images/page_top_banners/banner.png');

    render() {
        return (
            <div style={styles.choosingVerbozeDiv}>
            	<PageTopBanner title="Choosing Verboze is the best thing you will ever do to your Hotel" imageUrl={ this._banner_img } />
            </div>
        );
    };
};

const styles = {
    choosingVerbozeDiv: {
        height: '100vh',
        background: 'grey',
        color: 'white',
    }
};
