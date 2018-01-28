/* @flow */

import React, { Component } from 'react';

import ContentPage from './components/ContentPage';

type PropsType = {};

type StateType = {};

export default class ChoosingVerboze extends Component<PropsType, StateType> {
    _contentProps: {title: string, banner: string, sections:Array<Object>} = {
        title: "Choosing Verboze is the best thing you will ever do to your Hotel",
        banner: require('../../../assets/images/page_top_banners/banner.png'),
        sections: [{
            name: "Retrofitting",
            slug: "retrofitting",
            pageUrl: "/adopting-verboze"
        }, {
            name: "Customization",
            slug: "customization",
            pageUrl: "/adopting-verboze"
        }, {
            name: "Demo",
            slug: "demo",
            pageUrl: "/adopting-verboze"
        }]
    };

    render() {
        return (
            <ContentPage {...this._contentProps} >
                <div className="container" id="choosing-verboze-container">
                    <div id="retrofitting-info" style={ styles.textDivStyle }>
                        <h1>Retrofitting</h1>
                        <br />
                        <p>
                            We carefully engineered and designed our system to work with any infrastructure setup your hotel currently has, with minimal to no changes required on your end. You will not need to renovate your rooms to adopt the system. By retrofitting our system into the existing infrastructure, we are able to provide a cost effective solution that fits the specific needs of your hotel.
                        </p>
                    </div>
                    <div id="customization-info" style={ styles.textDivStyle }>
                        <h1>Customization</h1>
                        <br />
                        <p>
                            Each hotel brand is different, there is no one-size-fits-all in this business. With that in mind, you can pick and choose the features that are most important to your hotel. We also customize the user interface to match the image and feel of your brand so things do not feel out of place.
                        </p>
                        <p>
                            This is just the tip of the iceberg, we are sure that there are somethings that you would love to have but we currently do not provide, in that case we are more than happy to listen to your needs and implement new features.
                        </p>
                    </div>
                    <div id="demo-info" style={ styles.textDivStyle }>
                        <h1>Demo</h1>
                        <br />
                        <p>
                            We are open to installing a free demo in a room to showcase the different features that we have   and allow you to choose which ones suit you best. This is also the best time for you to provide customization details to make it fit just right. Click the button below to request a demo.
                        </p>
                    </div>
                </div>
            </ContentPage>
        );
    };
};

const styles = {
    textDivStyle: {
        fontWeight: 'lighter',
        paddingTop: 60
    }
};
