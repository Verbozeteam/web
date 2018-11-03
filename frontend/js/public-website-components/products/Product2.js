import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import type { ProductType } from './Products';
import ContentPage from './components/ContentPage';
import ImageHolder from './components/ImagesHolder';

const Product2: ProductType = {
    name: 'Phone App',
    link: '/phone-app',
    image: require('../../../assets/images/adopting_verboze_panel.jpg'),
    page: {
        title: "Carving the path to a seamless future",
        banner: require('../../../assets/images/adopting_verboze.jpg'),
        sections: [{
            name: "Features",
            slug: "features",
            renderContent: () =>
                <div>
                    <p>{"Our freely available app (on both "}
                    <Link style={{color: '#BA3737'}} to={""}>{"iOS"}</Link>
                    {" and "}
                    <Link style={{color: '#BA3737'}} to={""}>{"Android"}</Link>
                    {") allows guests to access all of our smart room features from the comfort of their smartphone. All the guests have to do is download our app, scan the QR code in the room and they are in."}</p>
                    <ImageHolder images={[
                        require('../../../assets/images/lightbulb3.png'),
                        require('../../../assets/images/lightbulb3.png'),
                    ]} />
                </div>
        }, {
            name: "Installation",
            slug: "installation",
            renderContent: () =>
                <div>
                    <p>{"The phone app system is installed in addition to our smart room system. Installation varies depending on your hotel, but usually we use the existing wireless network in your room to all the guests’ phones to access them. The installation is very simple and can be done within minutes."}</p>
                </div>
        }, {
            name: "API Integration",
            slug: "api-integration",
            renderContent: () =>
                <div>
                    <p>{"Our cloud uses simple and secure APIs to enable the phone app to control the rooms. We are open to integrating the our API in your own, existing phone app to extend its functionality and allow it to control the room. This way, your guest will be more incentivized to use it instead of having the option of using two separate apps."}</p>
                </div>
        }, {
            name: "Pricing",
            slug: "pricing",
            renderContent: () =>
                <div>
                    <p>{"We charge an annual subscription fee per room to activate the phone app functionality for the hotel."}</p>
                </div>
        }]
    },
    component: () => <ContentPage product={Product2} />,
};

export default Product2;
