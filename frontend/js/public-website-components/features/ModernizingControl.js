/* @flow */

import React, { Component } from 'react';

import PageTopBanner from '../PageTopBanner';
const FeaturesPanels = require('../FeaturesPanels');


type PropsType = {};

type StateType = {};


export default class ModernizingControl extends Component<PropsType, StateType> {
	_banner_img = require('../../../assets/images/page_top_banners/banner.png');

    render() {
        return (
					<div>
						<div style={styles.modernizingControlDiv}>
            	<PageTopBanner title="Introducing the Hospitality Industry to the 21st Century" imageUrl={ this._banner_img } />
            </div>
						<FeaturesPanels expanded={false} />
					</div>
        );
    };
};

const styles = {
    modernizingControlDiv: {
        height: '100vh',
        background: 'grey',
        color: 'white',
    }
};