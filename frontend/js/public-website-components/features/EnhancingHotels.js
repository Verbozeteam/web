/* @flow */

import React, { Component } from 'react';

import PageTopBanner from '../PageTopBanner';
import SideNavBar from '../features/components/SideNavBar'
const RequestDemoModal = require('../RequestDemoModal');
const RequestDemoBanner = require('../RequestDemoBanner');
const FeaturesPanels = require('../FeaturesPanels');


type PropsType = {};

type StateType = {
    modal_open: boolean
};


export default class EnhancingHotels extends Component<PropsType, StateType> {
    _banner_img = require('../../../assets/images/reimagining_hotels.jpg');

    _sections = [
        {
            name: "Enhancing Hotels",
            slug: "enhancing-hotels",
            pageUrl: "/enhancing-hotels"
        },
        {
            name: "Feedback",
            slug: "feedback",
            pageUrl: "/enhancing-hotels"
        },
        {
            name: "Insights",
            slug: "insights",
            pageUrl: "/enhancing-hotels"
        },
        {
            name: "Luxury",
            slug: "luxury",
            pageUrl: "/enhancing-hotels"
        },
    ];

    state = {
        modal_open: false
    };

    toggleModal() {
        const { modal_open } = this.state;

        this.setState({
          modal_open: !modal_open
        });
    };

    render() {
        const { modal_open } = this.state;

        return (
            <div>
                <RequestDemoModal open={modal_open}
                    toggle={this.toggleModal.bind(this)} />
                <div style={styles.enhancingHotelsDiv}>
                    <PageTopBanner title="Enhancing Hotels is our middle name, let us take care of it for You" imageUrl={ this._banner_img } />
                    <SideNavBar sections={ this._sections } containerId="enhancing-hotels-container" />
                    <div className="container" id="enhancing-hotels-container">
                        <div id="enhancing-hotels-info" style={ styles.textDivStyle }>
                            SOME CONTENT HERE ABOUT ENHANCING HOTELS
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                        </div>
                        <div id="feedback-info" style={ styles.textDivStyle }>
                            SOME CONTENT ABOUT GETTING FEEDBACK HERE
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                        </div>
                        <div id="insights-info" style={ styles.textDivStyle }>
                            SOME CONTENT ABOUT GETTING INSIGHTS HERE
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                        </div>
                        <div id="luxury-info" style={ styles.textDivStyle } >
                            SOME CONTENT ABOUT HOW THIS WILL INCREASE LUXURY HERE
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                        </div>
                    </div>
                </div>
                <RequestDemoBanner toggleModal={this.toggleModal.bind(this)} />
                <FeaturesPanels expanded={false} />
            </div>
        );
    };
};

const styles = {
    enhancingHotelsDiv: {
        minHeight: '100vh',
        color: 'white',
    },

    textDivStyle: {
        paddingTop: 60
    }
};
