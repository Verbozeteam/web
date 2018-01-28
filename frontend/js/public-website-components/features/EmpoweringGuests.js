/* @flow */

import React, { Component } from 'react';

import ContentPage from './components/ContentPage';

type PropsType = {};

type StateType = {};

export default class EmpoweringGuests extends Component<PropsType, StateType> {
    _contentProps: {title: string, banner: string, sections:Array<Object>} = {
        title: "Empowering Guests to take control of their hotel stay",
        banner: require('../../../assets/images/empowering_guests.jpg'),
        sections: [{
            name: "Reservation Data",
            slug: "reservation-data",
            pageUrl: "/empowering-guests"
        }, {
            name: "Room Services",
            slug: "room-services",
            pageUrl: "/empowering-guests"
        }, {
            name: "Feedback",
            slug: "feedback",
            pageUrl: "/empowering-guests"
        }, {
            name: "Keyless Entry",
            slug: "keyless-entry",
            pageUrl: "/empowering-guests"
        }],
    };

    render() {
        return (
            <ContentPage {...this._contentProps} >
                <div id="reservation-data-info" style={ styles.textDivStyle }>
                    <div style={styles.header}>Reservation Data</div>
                    <br />
                    <p>
                        Guests can review information regarding their reservation, billing, check-out time, wifi password, duration of their stay, amenities the hotel has to offer and much more. Keeping the guests aware of their reservation details and expenditure prevents any unpleasant surprises at checkout time.
                    </p>
                </div>
                <div id="room-services-info" style={ styles.textDivStyle }>
                    <div style={styles.header}>Room Services</div>
                    <br />
                    <p>
                        Guests are able to request pillows, sheets, toiletries or any other services your hotel chooses to offer at the comfort of their fingertips. Requests will be forwarded to your staff who will serve your guest.
                    </p>
                </div>
                <div id="feedback-info" style={ styles.textDivStyle }>
                    <div style={styles.header}>Feedback</div>
                    <br />
                    <p>
                        Guests can provide feedback to the staff to let them know about any inconveniences encountered. The staff can use the feedback to tailor their treatment and services and ensure guest satisfaction. The last thing a hotel wants is having a guest leave unhappy without knowing why and trying to make it right for them.
                    </p>
                </div>
                <div id="keyless-entry-info" style={ styles.textDivStyle } >
                    <div style={styles.header}>Keyless Entry</div>
                    <br />
                    <p>
                        Guests will gain access to their rooms and other amenities in your hotel, such as pools or spas, using only their smartphones. There will no longer be a need to carry around cards or ask for permissions or availability of amenities.
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
