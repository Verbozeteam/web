/* @flow */

import React, { Component } from 'react';

import ContentPage from './components/ContentPage';

import { Helmet } from 'react-helmet';

type PropsType = {};

type StateType = {};

export default class ReImaginingHotels extends Component<PropsType, StateType> {
    _contentProps: {title: string, banner: string, sections:Array<Object>} = {
        title: "A hotel experience like never before",
        banner: require('../../../assets/images/reimagining_hotels.jpg'),
        sections: [{
            name: "Preferences",
            slug: "preferences",
            pageUrl: "/reimagining-hotels"
        }, {
            name: "Automation",
            slug: "automation",
            pageUrl: "/reimagining-hotels"
        }],
    }

    render() {
        return (
            <ContentPage {...this._contentProps} >

                <Helmet>
                  <title>Reimagining Hotels | Verboze</title>
                  <meta name="description" content="A hotel experience like never before." />
                  <meta name="path" content="/reimagining-hotels" />
                </Helmet>

                <div id="preferences-info" style={ styles.textDivStyle }>
                    <div style={styles.header}>Preferences</div>
                    <br />
                    <p>
                        Each of your guests lives in their own unique home, with their favorite T.V. channels and their preferred room temperature set, so why should they all have the same cookie-cut experience when they stay at your hotel?
                    </p>
                    <p>
                        These preferences along with extra pillows, room lighting and much more can be carried with them to any of your hotel branches as long as it has our system. This allows your hotel to provide the same consistent personalized experience across your whole brand, without having to worry about any outliers that may harm your image.
                    </p>
                </div>
                <div id="automation-info" style={ styles.textDivStyle }>
                    <div style={styles.header}>Automation</div>
                    <br />
                    <p>
                        Your hotel will impress your guests with the most innovative automated convenience. Your guests can set alarms on the system to wake them up in the morning to a soothing melody and shining sunlight after automatically opening the curtains. The room will automatically turn on just enough light when the guest wakes up at night and tries to get off their bed.
                    </p>
                    <p>
                        There is no limit to how much more automation can bring to the experience, but it will only improve over time and with more data.
                    </p>
                </div>
            </ContentPage>
        );
    };
};

const styles = {
    header: {
        fontSize: 34,
    },
    textDivStyle: {
        fontWeight: 'lighter',
        paddingTop: 60
    }
};
