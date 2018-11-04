/* @flow */

import React, { Component, Fragment } from 'react';

import css from '../../css/public_website/Footer.css';

import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

import { ProductList } from './products/Products';

// Use it just like a RRv4 link (to can be a string or an object, see RRv4 api for details):
// <HashLink to="/some/path#with-hash-fragment">Link to Hash Fragment</HashLink>

type PropsType = {};

type StateType = {};


export default class Footer extends Component<PropsType, StateType> {

    _verboze_white = require('../../assets/images/verboze_white.png');

    render() {
        return (
            <div>
                <footer className="footer" style={ styles.footerStyle }>
                    <div className="container">

                        <div className="row" style={ styles.footerRowStyle }>
                            <div className="col-md-2 footer-col-md-2">
                                <div className="row">
                                    <div className="col footer-col">
                                        <Link to={'/'}>
                                          <img src={ this._verboze_white } className="d-inline-block align-top" alt="" style={ styles.logoStyle }/>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2 footer-col-md-2">
                                <div className="row">
                                    <div className="col footer-col">
                                        PRODUCTS
                                    </div>
                                </div>
                                <hr style={ styles.hrStyle }/>
                                {ProductList.map(product =>
                                    <div className="row" key={'footer-row-'+product.name}>
                                        <div className="col footer-col">
                                            <Link className="footer-link" to={product.link}>
                                                {product.name}
                                            </Link>
                                        </div>
                                    </div>
                                )}
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
                                {/* <div className="row">
                                    <div className="col footer-col">
                                        <Link className="footer-link" to='/company'>
                                            Vision
                                        </Link>
                                    </div>
                                </div> */}
                                <div className="row">
                                    <div className="col footer-col">
                                        <HashLink className="footer-link" to='/company#founders'>
                                            Founders
                                        </HashLink>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col footer-col">
                                        <HashLink className="footer-link" to='/company#office-location'>
                                            Office Location
                                        </HashLink>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 footer-col-md-2">
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
                                        <a href="mailto:contact@verboze.com" className="footer-link" style={ styles.contactLinkStyle }>
                                          <i className={'fa fa-envelope'}>&nbsp;&nbsp;</i>contact@verboze.com
                                        </a>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col footer-col">
                                        <a href={'https://www.linkedin.com/company/verboze'} className={'footer-link'}>
                                          <i className={'fa fa-linkedin'}></i>&nbsp;&nbsp;LinkedIn
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="row">
                                    <div className="col footer-col">
                                        <span className="float-right">2018 Verboze. All Rights Reserved.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </footer>
            </div>
        );
    }
}


const styles = {
    footerStyle: {
        borderTop: '#444444 1px solid',
        padding: 30,
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
        color: '#BA3737',
    }

};
