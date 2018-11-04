import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import type { ProductType } from './Products';
import ContentPage from './components/ContentPage';
import ImageHolder from './components/ImagesHolder';

const Product4: ProductType = {
    name: 'Customization',
    link: '/customization',
    image: require('../../../assets/images/customization_panel.jpg'),
    page: {
        title: "Customization",
        banner: require('../../../assets/images/customization.jpg'),
        sections: [{
            name: "Night Lights",
            slug: "night-lights",
            renderContent: () =>
                <div>
                    <p>{"Upon request, we can install automated night lights that glow to assist the guest when walking around your room in the middle of the night. The lights activate by motion and can be configured to to have multiple sensors to achieve any coverage, sensitivity, on-duration and color temperature."}</p>
                    <ImageHolder images={[
                        require('../../../assets/images/night_lights.jpg'),
                    ]} />
                </div>
        }, {
            name: "USB International Sockets",
            slug: "usb-sockets",
            renderContent: () =>
                <div>
                    <p>{"We utilize the space and location of the old wall switches that are replaced with the tablets by installing USB/International sockets that add more convenience for the guests."}</p>
                </div>
        }, {
            name: "Tablet Customization",
            slug: "tablet-customization",
            renderContent: () =>
                <div>
                    <p>{"We can customize the tablet’s frame, interface and screen size. If you have any special design requests, we are open to discuss and make something special for your special room. We also customize the interface aesthetics, languages and colors."}</p>
                </div>
        }, {
            name: "Additional Room Features",
            slug: "additional-room-features",
            renderContent: () =>
                <div>
                    <p>{"Specific room features, such as courtesy lights or specific conditional behavior can be programmed and embedded in the system. We can integrate light, motion, touch or any other sensors to perform any specific actions your room may require, like turning on a light or setting the thermostat."}</p>
                </div>
        }]
    },
    component: () => <ContentPage product={Product4} />,
};

export default Product4;
