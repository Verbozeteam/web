/* @flow */

import React, { Component } from 'react';

import PageTopBanner from '../PageTopBanner';
import SideNavBar from '../features/components/SideNavBar';
const FeaturesPanels = require('../FeaturesPanels');


type PropsType = {};

type StateType = {};


export default class EmpoweringGuests extends Component<PropsType, StateType> {
    _banner_img = require('../../../assets/images/page_top_banners/banner.png');

    _sections = [
        {
            name: "Empowering Guests",
            slug: "empowering-guests",
            pageUrl: "/empowering-guests"
        },
        {
            name: "Control",
            slug: "control",
            pageUrl: "/empowering-guests"
        },
        {
            name: "Request",
            slug: "request",
            pageUrl: "/empowering-guests"
        },
        {
            name: "Keyless Entry",
            slug: "keyless-entry",
            pageUrl: "/empowering-guests"
        },
    ];

    render() {
        return (
            <div>
                <div style={styles.empoweringGuestsDiv}>
                    <PageTopBanner title="Empowering Guests make them feel that they have a say in the place they choose to stay" imageUrl={ this._banner_img } />
                    <SideNavBar sections={ this._sections } containerId="empowering-guests-container" />
                    <div className="container"  id="empowering-guests-container">
                        <div id="empowering-guests-info" style={ styles.textDivStyle }>
                            SOME CONTENT HERE ABOUT EMPOWERING GUESTS
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
                        <div id="control-info" style={ styles.textDivStyle }>
                            SOME CONTENT ABOUT CONTROL HERE
                            <br/>
                            <br/>
                            <br/>

                            <br/>
                            <br/>
                        </div>
                        <div id="request-info" style={ styles.textDivStyle }>
                            SOME CONTENT ABOUT REQUESTING ROOM SERVICE/CONCEIRGE/ORDER TO ROOM/DO NOT DISTIRUB HERE
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
                        <div id="keyless-entry-info" style={ styles.textDivStyle } >
                            SOME CONTENT ABOUT KEYLESS ENTRY HERE
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
                <FeaturesPanels expanded={false} />
            </div>

        );
    };
};

const styles = {
    empoweringGuestsDiv: {
        minHeight: '100vh',
        background: 'black',
        color: 'white',
    },

    textDivStyle: {
        paddingTop: 60
    }
};
