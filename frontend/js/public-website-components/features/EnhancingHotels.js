/* @flow */

import React, { Component } from 'react';

import PageTopBanner from '../PageTopBanner';
const FeaturesPanels = require('../FeaturesPanels');


type PropsType = {};

type StateType = {};


export default class EnhancingHotels extends Component<PropsType, StateType> {
	_banner_img = require('../../../assets/images/page_top_banners/banner.png');

    render() {
        return (
					<div>
						<div style={styles.enhancingHotelsDiv}>
                <PageTopBanner title="Enhancing Hotels is our middle name, let us take care of it for You" imageUrl={ this._banner_img } />
            </div>
						<FeaturesPanels expanded={false} />
					</div>
        );
    };
};

const styles = {
    enhancingHotelsDiv: {
        height: '100vh',
        background: 'grey',
        color: 'white',
    }
};
