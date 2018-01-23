/* @flow */

import React, { Component, Fragment } from 'react';

import css from '../../css/public_website/navbar.css';

import {
  NavLink,
  Link
} from 'react-router-dom';


type PropsType = {};

type StateType =  {
    sticky: boolean,
};

export default class NavBar extends Component<PropsType, StateType> {

    state = {
        sticky: false,
    };

    _verboze_logo = require('../../assets/images/logo_symbol.png');

    renderNavbarContent(navbarTogglerId: string, navbarDropdownId: string) {
        return (
            <div className="container">
                <NavLink className="navbar-brand" exact to="/">
                    <img src={ this._verboze_logo } height="30" className="d-inline-block align-top" alt="" id="navbarLogo"/>
                    VERBOZE
                </NavLink>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#${navbarTogglerId}" aria-controls="${navbarTogglerId}" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="${navbarTogglerId}">
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0"></ul>
                    <ul className="navbar-nav mt-2 mt-lg-0">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="${navbarDropdownId}" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                FEATURES
                            </a>
                            <div className="dropdown-menu" aria-labelledby="${navbarDropdownId}">
                                <Link className="dropdown-item" to="/modernizing-control">
                                    Modernizing Control
                                </Link>
                                <div className="dropdown-divider"></div>
                                <Link className="dropdown-item" to="/empowering-guests">
                                    Empowering Guests
                                </Link>
                                <div className="dropdown-divider"></div>
                                <Link className="dropdown-item" to="/enhancing-hotels">
                                    Enhancing Hotels
                                </Link>
                                <div className="dropdown-divider"></div>
                                <Link className="dropdown-item" to="/choosing-verboze">
                                    Choosing Verboze
                                </Link>
                            </div>
                        </li>
                        <NavLink className="nav-item" activeClassName="active" to='/company'>
                            <span className="nav-link">
                                COMPANY
                            </span>
                        </NavLink>

                        <NavLink className="nav-item" activeClassName="active" to='/contact'>
                            <span className="nav-link">
                                CONTACT
                            </span>
                        </NavLink>
                    </ul>
                </div>
            </div>
        );
    };

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll(e: Event) {
        let temp1 = document.scrollingElement || document.documentElement;

        if (!(temp1 === null)) {
            let temp2 = temp1.scrollTop
            if (!(temp2 === null)) {
                if (temp2 > 0 && !this.state.sticky) {
                    this.setState({sticky: true});
                } else if (temp2 <= 0 && this.state.sticky) {
                    this.setState({sticky: false});
                }
            }
        }

    }

    render() {
        const { sticky } = this.state;

        var stickyNavStyle = {};
        var fixedNavbarStyle = {};
        if (!sticky) {
            stickyNavStyle = {...styles.stickyNavbar, ...styles.navbarHidden};
            fixedNavbarStyle = styles.fixedNavbar;
        } else {
            stickyNavStyle = styles.stickyNavbar;
            fixedNavbarStyle = {...styles.fixedNavbar, ...styles.fixedNavbarHidden};
        }

        return (
            <div>
                <nav style={stickyNavStyle} className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
                    { this.renderNavbarContent('navbarTogglerSticky', 'navbarDropdownSticky') }
                </nav>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{...{ position: 'absolute' }, ...fixedNavbarStyle}}>
                    { this.renderNavbarContent('navbarToggler', 'navbarDropdown') }
                </nav>
            </div>
        );
    };
};


const styles = {
    stickyNavbar: {
        transition: 'opacity 300ms, margin-top 300ms',
    },

    fixedNavbar: {
        transition: 'opacity 300ms',
    },

    navbarHidden: {
        opacity: 0,
        marginTop: -100,
    },

    fixedNavbarHidden: {
        opacity: 0,
    },
}