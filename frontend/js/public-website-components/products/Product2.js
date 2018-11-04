import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import type { ProductType } from './Products';
import ContentPage from './components/ContentPage';
import ImageHolder from './components/ImagesHolder';

const Product2: ProductType = {
    name: 'Phone App',
    link: '/phone-app',
    image: require('../../../assets/images/mobile_iPhone_panel.jpg'),
    page: {
        title: "Phone App",
        banner: require('../../../assets/images/mobile_iPhone.jpg'),
        sections: [{
            name: "Features",
            slug: "features",
            renderContent: () =>
                <div>
                    <p>{"Our freely available app (on both "}
                    <Link style={{color: '#BA3737'}} to={APP_STORE_LINK}>{"iOS"}</Link>
                    {" and "}
                    <Link style={{color: '#BA3737'}} to={PLAY_STORE_LINK}>{"Android"}</Link>
                    {") allows guests to access all of our smart room features from the comfort of their smartphone. All the guests have to do is download our app, scan the QR code in your room and they are in."}</p>
                    <ImageHolder images={[
                        require('../../../assets/images/phones.png'),
                    ]} />
                </div>
        }, {
            name: "Installation",
            slug: "installation",
            renderContent: () =>
                <div>
                    <p>{"The phone app system is installed in addition to our smart room system. Installation varies depending on your hotel, but usually we use the existing wireless network in your room to allow the guests’ phones to access and control your room. The installation is very simple and can be done within minutes."}</p>
                </div>
        }, {
            name: "API Integration",
            slug: "api-integration",
            renderContent: () =>
                <div>
                    <p>{"Our cloud uses simple and secure APIs to enable the phone app to control your rooms. We are open to integrating the our API in your own, existing phone app to extend its functionality and allow it to control your room. This way, your guest will be more incentivized to use it instead of having the option of using two separate apps."}</p>
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
