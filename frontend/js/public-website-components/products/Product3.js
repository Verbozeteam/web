import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import type { ProductType } from './Products';
import ContentPage from './components/ContentPage';
import ImageHolder from './components/ImagesHolder';

const Product3: ProductType = {
    name: 'Room Diagnostics',
    link: '/room-diagnostics',
    image: require('../../../assets/images/diagnostics_dashboard_with_human_panel.jpg'),
    page: {
        title: "Room Diagnostics",
        banner: require('../../../assets/images/diagnostics_dashboard_with_human.jpg'),
        sections: [{
            name: "Motivation",
            slug: "motivation",
            renderContent: () =>
                <div>
                    <p>{"One of the worst things a hotel guest can experience during their stay is if the AC doesn’t function properly, or if there is an issue with the lights. The guest will remember the bad experience which will overshadow all other positive experiences in the hotel. For that reason we built a system with sensors that preemptively informs the staff about any malfunctions as soon as they occur."}</p>
                </div>
        }, {
            name: "How it works",
            slug: "how-it-works",
            renderContent: () =>
                <div>
                    <p>{"We install the system in your room and reroute the wires of the room to it. The rerouting is all done in a central spot in your room (the electrical distribution board) and it requires no breaking walls, pulling wires or making any heavy changes to your room. The sensors in the system analyze and monitor the state of your room, using our machine learning algorithm, not only can we detect faults in your room, but also predict them ahead of time."}</p>
                </div>
        }, {
            name: "Dashboard",
            slug: "dashboard",
            renderContent: () =>
                <div>
                    <p>{"Our real time dashboard gives the hotel staff a holistic view of all your rooms. They can see the status of your rooms, whether they requested housekeeping or asked not to be disturbed. All room orders are displayed on the dashboard as they come in. Performing automated room diagnostics to a room before sending the guest to it is just a click away."}</p>
                    <ImageHolder images={[
                        require('../../../assets/images/dashboard_monitor.png'),
                    ]} />
                </div>
        }, {
            name: "Pricing",
            slug: "pricing",
            renderContent: () =>
                <div>
                    <p>{"We charge an annual subscription fee per room to activate automated room diagnostics functionality for the hotel."}</p>
                </div>
        }]
    },
    component: () => <ContentPage product={Product3} />,
};

export default Product3;
