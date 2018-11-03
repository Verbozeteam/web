/* @flow */

import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

import type { ProductType } from '../Products.js';

import SideNavBar from './SideNavBar';
import PageTopBanner from '../../PageTopBanner';
const RequestDemoModal = require('../../RequestDemoModal');
const RequestDemoBanner = require('../../RequestDemoBanner');
const FeaturesPanels = require('../../FeaturesPanels');

type SectionType = {
    name: string,
    url: string,
    slug: string,
};

type PropsType = {
    product: ProductType,
};

type StateType = {
    modal_open: boolean,
    width: number,
    height: number,
};


export default class ContentPage extends Component<PropsType, StateType> {
    state = {
        modal_open: false,
        width: 1,
        height: 1,
    };

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
    }

    updateWindowDimensions() {
        this.setState({ width: document.documentElement.clientWidth, height: window.innerHeight });
    }

    toggleModal() {
        const { modal_open } = this.state;

        this.setState({
          modal_open: !modal_open
        });
    };

    render() {
        const { product } = this.props;
        const { modal_open, width } = this.state;

        var isOnPhone = width <= 992;

        var sidenav = null;
        if (!isOnPhone)
            sidenav = <SideNavBar product={product} containerId="content-container" />;

        return (
            <div>
                <RequestDemoModal open={modal_open}
                    toggle={this.toggleModal.bind(this)} />

                <div style={styles.headerDivStyle}>
                    <PageTopBanner title={product.page.title} imageUrl={product.page.banner} />
                    <div className="container" id="content-container">
                        <div className="row">
                            <div className="col-md-9">
                                <Helmet>
                                    <title>Adopting Verboze | Verboze</title>
                                    <meta name="description" content={product.page.title} />
                                    <meta name="path" content={product.link} />
                                </Helmet>

                                <div className="container" id="choosing-verboze-container">
                                    {product.page.sections.map(section =>
                                        <div id={section.slug} style={styles.textDivStyle} key={'section-' + section.slug}>
                                            <div style={styles.header}>
                                                {section.name}
                                            </div>
                                            {section.renderContent()}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-3">
                                {sidenav}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{minHeight: 92}} />
                <RequestDemoBanner toggleModal={this.toggleModal.bind(this)} />
                <FeaturesPanels expanded={false} />
            </div>
        );
    };
};

const styles = {
    headerDivStyle: {
        fontWeight: 'lighter',
        minHeight: '100vh',
        color: 'white',
    },
    header: {
        fontSize: 34,
    },
    textDivStyle: {
        fontWeight: 'lighter',
        fontSize: 18,
        paddingTop: 60
    },
};
