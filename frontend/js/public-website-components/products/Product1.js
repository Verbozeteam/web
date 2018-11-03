import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import type { ProductType } from './Products';
import ContentPage from './components/ContentPage';
import ImageHolder from './components/ImagesHolder';

import { ProductList } from './Products';

const Product1: ProductType = {
    name: 'Smart Room',
    link: '/smart-room',
    image: require('../../../assets/images/adopting_verboze_panel.jpg'),
    page: {
        title: "Carving the path to a seamless future",
        banner: require('../../../assets/images/adopting_verboze.jpg'),
        sections: [{
            name: "Features",
            slug: "features",
            renderContent: () =>
                <div>
                    <p>{"The Verboze system can make everything in your hotel room smart. Some of the features include:"}</p>
                    <ul>
                        <li>{"Room lighting (switches and dimmers)"}</li>
                        <li>{"Thermostat/AC"}</li>
                        <li>{"Motorized curtains"}</li>
                        <li>{"Room status indicators (do not disturb and housekeeping signs outside the room)"}</li>
                        <li>{"Alarm clock"}</li>
                        <li>{"Order room service"}</li>
                        <li>{"Integration with keycard"}</li>
                        <li>{"Digitized door locks"}</li>
                        <li>{"Other room-specific features, see "} <Link style={{color: '#BA3737'}} to={ProductList.filter(p => p.name.toLowerCase() === 'customization')[0].name}>{"customization"}</Link></li>
                    </ul>
                </div>
        }, {
            name: "Tablets",
            slug: "tablets",
            renderContent: () =>
                <div>
                    <p>{"Controlling your smart rooms can be done using our intuitive tablets, which are conveniently placed near the bed for easy access. You can choose between our wired and wireless models, which can both be customized to match your design."}</p>
                    <ImageHolder images={[
                        require('../../../assets/images/lightbulb3.png'),
                        require('../../../assets/images/lightbulb3.png'),
                    ]} />
                    <p>{"The interface on our tablets is very simple and intuitive for guests to use. The guests won’t have to walk away from their bed to change the temperature or turn off the bathroom lights, all the controls will be at their fingertips."}</p>
                    <ImageHolder images={[
                        require('../../../assets/images/lightbulb3.png'),
                        require('../../../assets/images/lightbulb3.png'),
                        require('../../../assets/images/lightbulb3.png'),
                    ]} />
                    <p>{"Additional features can be implemented upon request, see "}<Link style={{color: '#BA3737'}} to={ProductList.filter(p => p.name.toLowerCase() === 'customization')[0].name}>{"customization"}</Link>{"."}</p>
                </div>
        }, {
            name: "How It Works",
            slug: "how-it-works",
            renderContent: () =>
                <div>
                    <p>{"We simply install our hardware, a small controller unit, in your room and reroute the wires of the room to it. The rerouting is all done in a central spot in your room (the electrical distribution board) and it requires no breaking walls, pulling wires or making any heavy changes to the room. Once our controller is installed, your room becomes smart and guests can conveniently control it from our tablets or their smartphones."}</p>
                    <p>{"Your room will remain the same, with the same light bulbs, same thermostat system, and the same overall setup, except that they will all become smart."}</p>
                </div>
        }, {
            name: "Pricing",
            slug: "pricing",
            renderContent: () =>
                <div>
                    <p>{"Our pricing model is simple, we charge a one-time installation fee plus a annual service fee per room. Since our system is retrofitted and does not require major changes to the room, we are able to provide much more cost effective pricing than our competition."}</p>
                </div>
        }]
    },
    component: () => <ContentPage product={Product1} />,
};

export default Product1;
