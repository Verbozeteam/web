/* @flow */

import React, { Component } from 'react';

import css from '../../css/public_website/pageTopBanner.css';

type PropsType = {
	title: string,
	imageUrl: string
};

type StateType = {};

export default class PageTopBanner extends Component<PropsType, StateType> {

	render() {
		return (
			<div className="jumbotron jumbotron-fluid" style={{ backgroundImage: 'url(\'' + this.props.imageUrl + '\')',  ...styles.pageTopBannerDiv }}>
				<div className="container" style={ styles.bannerContainer }>
					<div className="banner-title" style={ styles.bannerTitleStyle }>
						{ this.props.title }
					</div>
				</div>
			</div>
		);
	};
};

const styles = {
	pageTopBannerDiv: {
		backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
		height: 480,
	},

	bannerContainer: {
		height: '100%',
		position: 'relative',
	},

	bannerTitleStyle: {
		position: 'absolute',
  		bottom: 0,
  		fontSize: '50px',
  		fontWeight: 'lighter',
	}
};
