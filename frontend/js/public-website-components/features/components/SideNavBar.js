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

    scrolledPastElement(elem: Object) {
        let screenTop = document.scrollingElement || document.documentElement;

        var elementTop = elem.offsetTop + 480;
        var viewportTop = screenTop.scrollTop;
        return elementTop - 100 <= viewportTop;
    }

    isAtBottom(): Object {
        let screenTop = document.scrollingElement || document.documentElement;

        var container = document.getElementById(this.props.containerId);
        var containerTop = container.offsetTop;
        var containerBottom = containerTop + container.offsetHeight;
        var cutoff = 280;

        var update = {};

        if (containerBottom - screenTop.scrollTop <= cutoff && this.state.sticky && !this.state.bottom)
            update.bottom = true;
        else if (containerBottom - screenTop.scrollTop > cutoff && this.state.sticky && this.state.bottom)
            update.bottom = false;

        return update;
    }

    handleScroll(e: Event) {
        let tempScreenTop = document.scrollingElement || document.documentElement;
        var stateUpdate = {};

        /* determine to stick the side nav bar or not */
        if (tempScreenTop.scrollTop >= 495 && !this.state.sticky)
            stateUpdate = {...stateUpdate, sticky: true};
        else if (tempScreenTop.scrollTop < 495 && this.state.sticky)
            stateUpdate = {...stateUpdate, sticky: false};

        /* determine if navbar is at the bottom to stop it from going down further */
        stateUpdate = {...stateUpdate, ...this.isAtBottom()};

        /* determine which section we are on to change the diamond */
        var selectedElem = null;
        for (var j = 0; j < this.props.sections.length; j++) {
            var elemId = this.props.sections[j].slug + "-info";
            var elem = document.getElementById(elemId);
            if (this.scrolledPastElement(elem))
                selectedElem = elemId
        }
        if (selectedElem && this.state.currentSection !== selectedElem)
            stateUpdate = {...stateUpdate, currentSection: selectedElem};

        if (Object.keys(stateUpdate).length > 0)
            this.setState(stateUpdate);

        return null;
    };

    renderSVG() {
        var content = [
            <line key={"nav-line"} x1={20} x2={20} y1={20} y2={20 + 40*(this.props.sections.length-1)} style={styles.lineStyle} />
        ];
        for (var i = 0; i < this.props.sections.length; i++) {
            var curOffset = i * 40;
            var style = {...styles.diamondStyle};
            var s = 4;
            if (this.props.sections[i].slug+"-info" === this.state.currentSection) {
                s = 10;
                style.fill = "#BA3737";
            }
            var points = [
                (20)+  ","+(20+curOffset-s),
                (20+s)+","+(20+curOffset),
                (20)+  ","+(20+curOffset+s),
                (20-s)+","+(20+curOffset),
            ];
            content.push(<polygon key={"nav-diamond-"+i} points={points.join(" ")} style={style} />);
        }
        return <svg width={40} height={this.props.sections.length * 40}>{content}</svg>;
    }

    renderSections() {
        const { currentSection } = this.state;
        var sections = [];

        for (var i = 0; i < this.props.sections.length; i++) {
            var isSelected = (this.props.sections[i].slug+"-info") === currentSection;
            var padding = isSelected ? 15 : 5;
            var section = (
                <div key={"nav-section-"+i} style={{...styles.sectionFragment, paddingLeft: padding}}>
                    <HashLink
                        className={this.state.currentSection === this.props.sections[i].slug + "-info" ? "anchor-links selected-anchor" : "anchor-links"}
                        id={ this.props.sections[i].slug + "-hashlink" }
                        to={ this.props.sections[i].pageUrl + "#" +  this.props.sections[i].slug + "-info" }>
                        {this.props.sections[i].name}
                    </HashLink>
                </div>
            );
            sections.push(section);
        }

        return sections;
    }

    render () {
        const { sticky, bottom } = this.state;

        var content = (
            <Fragment>
                <div style={styles.leftPanel}>
                    {this.renderSVG()}
                </div>
                <div style={styles.rightPanel}>
                    {this.renderSections()}
                </div>
            </Fragment>
        );

        if (sticky) {
            if (!bottom) {
                return (
                    <div style={styles.stickyContainer}>
                        {content}
                    </div>
                );
            } else {
            return (
                <div style={styles.stickyBottomContainer}>
                    {content}
                </div>
            );
            }
        } else {
            return (
                <div style={styles.container}>
                    {content}
                </div>
            );
        }
    }
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 60,
    },
    stickyContainer: {
        position: 'fixed',
        display: 'flex',
        flexDirection: 'row',
        top: 75,
    },
    stickyBottomContainer: {
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
    },
    leftPanel: {
        width: 40,
    },
    rightPanel: {
        flex: 1,
    },
    sectionFragment: {
        height: 40,
        lineHeight: '40px',
        fontWeight: 'lighter',
    },

    lineStyle: {
        stroke: '#BA3737',
        strokeWidth: 2
    },
    diamondStyle: {
        stroke: '#ffffff',
        fill: '#ffffff',
        strokeWidth: 1,
    },
};
