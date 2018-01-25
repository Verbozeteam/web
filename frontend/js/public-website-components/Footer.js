/* @flow */

import React, { Component, Fragment } from 'react';

import css from '../../css/public_website/footer.css';

import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

// Use it just like a RRv4 link (to can be a string or an object, see RRv4 api for details):
// <HashLink to="/some/path#with-hash-fragment">Link to Hash Fragment</HashLink>

type PropsType = {};

type StateType = {};


export default class Footer extends Component<PropsType, StateType> {

    _verboze_white = require('../../assets/images/verboze_white.png');

    render() {
        return (
            <Fragment>
                <footer className="footer" style={ styles.footerStyle }>
                    <div className="container">

                        <div className="row" style={ styles.footerRowStyle }>
                            <div className="col-md-2 footer-col-md-2">
                                <div className="row">
                                    <div className="col footer-col">
                                        <img src={ this._verboze_white } className="d-inline-block align-top" alt="" style={ styles.logoStyle }/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2 footer-col-md-2">
                                <div className="row">
                                    <div className="col footer-col">
                                        FEATURES
                                    </div>
                                </div>
                                <hr style={ styles.hrStyle }/>
                                <div className="row">
                                    <div className="col footer-col">
                                        <Link className="footer-link" to='/modernizing-control'>
                                            Modernizing Control
                                        </Link>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col footer-col">
                                        <Link className="footer-link" to='/empowering-guests'>
                                            Empowering Guests
                                        </Link>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col footer-col">
                                        <Link className="footer-link" to='/enhancing-hotels'>
                                            Enhancing Hotels
                                        </Link>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col footer-col">
                                        <Link className="footer-link" to='/choosing-verboze'>
                                            Choosing Verboze
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2 footer-col-md-2">
                                <div className="row">
                                    <div className="col footer-col">
                                        <Link className="footer-link" to='/company'>
                                            COMPANY
                                        </Link>

                                    </div>
                                </div>
                                <hr style={ styles.hrStyle }/>
                                <div className="row">
                                    <div className="col footer-col">
                                        Vision
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col footer-col">
                                        Executive Team
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col footer-col">
                                        Office Location
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2 footer-col-md-2">
                                <div className="row">
                                    <div className="col footer-col">
                                        <Link className="footer-link" to='/contact'>
                                            CONTACT
                                        </Link>
                                    </div>
                                </div>
                                <hr style={ styles.hrStyle }/>
                                <div className="row">
                                    <div className="col footer-col">
                                        Request Demo
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col footer-col">
                                        <a href="mailto:contact@verboze.com" className="footer-link" style={ styles.contactLinkStyle }>contact@verboze.com</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="row">
                                    <div className="col footer-col">
                                        <span className="float-right">2018 Verboze. All Rights Reserved.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </footer>
            </Fragment>
        );
    }
}


const styles = {
    footerStyle: {
        borderTop: '#444444 1px solid',
        padding: 30,
        backgroundColor: 'black',
        color: 'white',
        fontWeight: 'lighter',
    },

    hrStyle: {
        borderTop: 0,
    },

    logoStyle: {
        height: 70,

    },

    footerRowStyle: {
        paddingTop: 25,
    },

    contactLinkStyle: {
        color: '#D04F4C',
    }

};
