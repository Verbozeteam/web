/* @flow */

import React, { Component } from 'react';

import PageTopBanner from '../PageTopBanner';

const FeaturesPanels = require('../FeaturesPanels');


type PropsType = {};

type StateType = {};


export default class ChoosingVerboze extends Component<PropsType, StateType> {
	_banner_img = require('../../../assets/images/page_top_banners/banner.png');

    render() {
        return (
					<div>
						<div style={styles.choosingVerbozeDiv}>
            	<PageTopBanner title="Choosing Verboze is the best thing you will ever do to your Hotel" imageUrl={ this._banner_img } />
						</div>
						<FeaturesPanels expanded={false} />
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
