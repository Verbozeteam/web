/* @flow */

import React, { Component } from 'react';

import ContentPage from './components/ContentPage';

type PropsType = {};

type StateType = {};

export default class ModernizingControl extends Component<PropsType, StateType> {
    _contentProps: {title: string, banner: string, sections:Array<Object>} = {
        title: "Introducing the Hospitality Industry to the 21st Century",
        banner: require('../../../assets/images/page_top_banners/banner.png'),
        sections: [{
            name: "Modernizing Control",
            slug: "modernizing-control",
            pageUrl: "/modernizing-control"
        }, {
            name: "In-room Touchscreen",
            slug: "tablet",
            pageUrl: "/modernizing-control"
        }, {
            name: "Guest's Smartphone",
            slug: "smartphone",
            pageUrl: "/modernizing-control"
        }, {
            name: "Voice Controls",
            slug: "voice-controls",
            pageUrl: "/voice",
        }],
    };

    render() {
        return (
            <ContentPage {...this._contentProps} >
                <div id="modernizing-control-info" style={ styles.textDivStyle }>
                    <h1>Modernizing Control</h1>
                    <p>
                        The Verboze system is installed in each of your hotel rooms allowing them to be automated and easily controlled. The system supports automating the following components:
                    </p>
                    <ul>
                        <li>Lights and Dimmers</li>
                        <li>Motorized Curtains</li>
                        <li>Air Conditioner</li>
                        <li>TV and Entertainment</li>
                        <li>Locking/Unlocking of the Door</li>
                        <li>Digital Room Service and Do Not Disturb Lights (outside the room)</li>
                        <li>And more...</li>
                    </ul>
                    <p>
                        All components can be easily accessed and controlled by the hotel staff and more importantly the guests.
                    </p>
                </div>
                <div id="tablet-info" style={ styles.textDivStyle }>
                    <h1>In-room Touchscreen</h1>
                    <p>
                        The primary control device that is installed in every room is a touchscreen that we provide, either portable or mounted on a wall. You may choose to have several touchscreen devices for different arrangements of your rooms or suites.
                    </p>
                </div>
                <div id="smartphone-info" style={ styles.textDivStyle }>
                    <h1>Guest App</h1>
                    <p>
                        Guests will have access to an app on their own smartphones which can connect to their booked rooms and give them control of the room for the duration of their stay.
                    </p>
                </div>
                <div id="voice-controls-info" style={ styles.textDivStyle }>
                    <h1>Voice Controls</h1>
                    <p>
                        Voice assistants can be installed in the rooms to enable voice-activated commands to control the room.
                    </p>
                </div>
            </ContentPage>
        );
    };
};

const styles = {
    textDivStyle: {
        fontWeight: 'lighter',
        paddingTop: 60,
    }
};
