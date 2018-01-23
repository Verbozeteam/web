/* @flow */

import React, { Component } from 'react';

import PageTopBanner from '../PageTopBanner';
const FeaturesPanels = require('../FeaturesPanels');


type PropsType = {};

type StateType = {};


export default class EmpoweringGuests extends Component<PropsType, StateType> {
	_banner_img = require('../../../assets/images/page_top_banners/banner.png');

    render() {
        return (
					<div>
						<div style={styles.empoweringGuestsDiv}>
        			<PageTopBanner title="Empowering Guests make them feel that they have a say in the place they choose to stay" imageUrl={ this._banner_img } />
            </div>
						<FeaturesPanels expanded={false} />
					</div>

        );
    };
};

const styles = {
    empoweringGuestsDiv: {
        height: '100vh',
        background: 'grey',
        color: 'white',
    }
};
