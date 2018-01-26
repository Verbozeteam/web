/* @flow */

import React, { Component, Fragment } from 'react';
import { HashLink } from 'react-router-hash-link';

import css from '../../../../css/public_website/SideNavBar.css';

type PropsType = {
    sections: Array<SectionType>,
    containerId: string
};

type StateType = {
    currentSection: string,
    sticky: boolean,
    bottom: boolean,
};

type SectionType = {
    name: string, /* name of section */
    slug: string, /* slug name of section (MUST BE UNIQUE) */
    pageUrl: string, /* respective feature page url */
};

export default class SideNavBar extends Component<PropsType, StateType> {

    /*
        ASSUMPTIONS:
            -   There will be at least 1 section passed in the props

            -   Section divs (in respective feature page) must be spaced out enough that the top of
                the previous section passes the top of the screen in order to show the section you
                are on in the side nav bar

            -   I am expecting props to be passed in the following format:
                [
                    {
                        name: "Tablet",
                        slug: "tablet",
                        pageUrl: "/modernizing-control"
                    }
                ]

            -   The `slug` passed in props must be unique per page, otherwise multiple sidebar icons
                will light up (common sense)

            -   The section divs (in respective feature page) must have an ID with name `[slug]-info`

            -   This side bar scales great with more or less sections, depending on how much passed in props.
                However the line that connects the diamonds will probably require some css tweaking, as it may
                be too short or too long. It looks best with 4 sections

            -   The id of the container of the respective feature page is passed in the props

    */

    state = {
        currentSection: this.props.sections[0].slug + "-info",
        sticky: false,
        bottom: false,
    };

    _bound_handleScroll = (e: Event): null => this.handleScroll(e);


    componentDidMount() {
        window.addEventListener('scroll', this._bound_handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this._bound_handleScroll)
    }

    isFullyInViewport(elem: Object) {
        let screenTop = document.scrollingElement || document.documentElement;

        var elementTop = elem.offsetTop;
        var elementBottom = elem.offsetTop + elem.offsetHeight;

        var viewportTop = screenTop.scrollTop;
        var viewportBottom = screenTop.scrollTop + window.innerHeight;

        return (elementTop - viewportTop < 180);

    }

    isAtBottom() {
        let screenTop = document.scrollingElement || document.documentElement;

        var container = document.getElementById(this.props.containerId);
        var containerTop = container.offsetTop;
        var containerBottom = containerTop + container.offsetHeight;

        if (containerBottom - screenTop.scrollTop <= 350 && this.state.sticky && !this.state.bottom){
            this.setState({
                bottom: true
            });
        }
        else if (containerBottom - screenTop.scrollTop > 350 && this.state.sticky && this.state.bottom) {
            this.setState({
                bottom: false
            });
        }
    }

    handleScroll(e: Event) {
        let tempScreenTop = document.scrollingElement || document.documentElement;

        /* determine to stick the side nav bar or not */
        if (tempScreenTop.scrollTop >= 435 && !this.state.sticky) {
            this.setState({
                sticky: true
            });
        }
        else if (tempScreenTop.scrollTop < 435 && this.state.sticky) {
            this.setState({
                sticky: false
            });
        }

        /* determine if navbar is at the bottom to stop it from going down further */
        this.isAtBottom();

        /* determine which section we are on to change the diamond */
        for (var j = 0; j < this.props.sections.length; j++) {
            var elemId = this.props.sections[j].slug + "-info";
            var elem = document.getElementById(elemId);

            if (this.isFullyInViewport(elem)){
                this.setState({
                    currentSection: elemId
                });
            };
        }

        return null;
    };

    renderSections() {
        var sections = [];

        for (var i = 0; i < this.props.sections.length; i++) {

            var section = (
                <Fragment key={i}>
                    <span
                        className={ this.state.currentSection === this.props.sections[i].slug + "-info" ?  "diamond-selector selected-diamond" : "diamond-selector" }
                        id={ this.props.sections[i].slug + "-diamond" }>
                    </span>
                    <HashLink
                        className={ this.state.currentSection === this.props.sections[i].slug + "-info" ? "anchor-links selected-anchor" : "anchor-links" }
                        id={ this.props.sections[i].slug + "-hashlink" }
                        to={ this.props.sections[i].pageUrl + "#" +  this.props.sections[i].slug + "-info" }>
                        {this.props.sections[i].name}
                    </HashLink>
                    <br/>
                </Fragment>
            );
            sections.push(section);
        }

        return sections;
    }

    renderSideNavBar() {
        const sections = this.renderSections();

        if (this.state.sticky) {
            if (this.state.bottom) {
                /* know where to stop the sidenav bar at the bottom */
                var container = document.getElementById(this.props.containerId);

                return (
                    <div className="side-nav-bar sticky-side-nav-bar sticky-side-nav-bar-bottom" style={{ top: container.offsetHeight - 276 }}>
                        <div className="side-nav-bar-content">
                            { sections }
                        </div>
                    </div>
                );
            }
            else {
                return (
                    <div className="side-nav-bar sticky-side-nav-bar">
                        <div className="side-nav-bar-content">
                            { sections }
                        </div>
                    </div>
                );
            }
        }
        else {
            return (
                <div className="side-nav-bar">
                    <div className="side-nav-bar-content">
                        { sections }
                    </div>
                </div>
            );
        }
    }

    render () {
        return (
            <div className="container">
                <div className="side-nav-bar-container">
                    { this.renderSideNavBar() }
                </div>
            </div>
        )
    };
};
