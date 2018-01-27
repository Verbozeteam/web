/* @flow */

import React, { Component } from 'react';

import PageTopBanner from '../PageTopBanner';
import SideNavBar from '../features/components/SideNavBar';
const RequestDemoModal = require('../RequestDemoModal');
const RequestDemoBanner = require('../RequestDemoBanner');
const FeaturesPanels = require('../FeaturesPanels');


type PropsType = {};

type StateType = {
    modal_open: boolean
};


export default class ChoosingVerboze extends Component<PropsType, StateType> {
    _banner_img = require('../../../assets/images/page_top_banners/banner.png');

    _sections = [
        {
            name: "Choosing Verboze",
            slug: "choosing-verboze",
            pageUrl: "/choosing-verboze"
        },
        {
            name: "Automation",
            slug: "automation",
            pageUrl: "/choosing-verboze"
        },
        {
            name: "Replication",
            slug: "replication",
            pageUrl: "/choosing-verboze"
        },
        {
            name: "Preferences",
            slug: "preferences",
            pageUrl: "/choosing-verboze"
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
                <div style={styles.choosingVerbozeDiv}>
                    <PageTopBanner title="Choosing Verboze is the best thing you will ever do to your Hotel" imageUrl={ this._banner_img } />
                    <SideNavBar sections={ this._sections } containerId="choosing-verboze-container" />
                    <div className="container" id="choosing-verboze-container">
                        <div id="choosing-verboze-info" style={ styles.textDivStyle }>
                            SOME CONTENT HERE ABOUT CHOOSING VERBOZE
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
                        <div id="automation-info" style={ styles.textDivStyle }>
                            SOME CONTENT ABOUT GETTING AUTOMATION HERE
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                            <br/>
                        </div>
                        <div id="replication-info" style={ styles.textDivStyle }>
                            SOME CONTENT ABOUT GETTING REPLICATION HERE
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
                        <div id="preferences-info" style={ styles.textDivStyle } >
                            SOME CONTENT ABOUT HOW THIS WILL PREFERENCES HERE
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
    choosingVerbozeDiv: {
        minHeight: '100vh',
        color: 'white',
    },

    textDivStyle: {
        paddingTop: 60
    }
};
