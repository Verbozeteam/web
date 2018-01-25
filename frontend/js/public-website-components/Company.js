/* @flow */

import React from 'react';

import PageTopBanner from './PageTopBanner';

const FounderCard = require('./FounderCard');

import { Link } from 'react-router-dom';

type PropsType = {};
type StateType = {};

export default class Company extends React.Component<PropsType, StateType> {
  _banner_img = require('../../assets/images/page_top_banners/banner.png');
  _title: string = 'Verboze is the best company to ever verbose.';
  _qstp: string = require('../../assets/images/qstp.jpg');

  _founders: Array<Object> = [
    {
      name: 'Hasan AlJawaheri',
      text: 'Co-Founder | CEO',
      email: 'hbj@verboze.com',
      image: require('../../assets/images/hasan.png')
    },
    {
      name: 'Mohammed M. Fituri',
      text: 'Co-Founder',
      email: 'mfituri@verboze.com',
      image: require('../../assets/images/fituri.png')
    },
    {
      name: 'Yusuf Musleh',
      text: 'Co-Founder',
      email: 'ymusleh@verboze.com',
      image: require('../../assets/images/yusuf.png')
    }
  ];

  _renderFoundersSection() {

    const founders = [];
    for (var i = 0; i < this._founders.length; i++) {
      founders.push(
        <FounderCard key={'founder-' + i}
          founder={this._founders[i]} />
      );
    }

    return (
      <div className={'container'} style={styles.section}>
        <h2 style={styles.header}>Executive Team</h2>
        <div className={'row justify-content-center'}>
          {founders}
        </div>
      </div>
    );
  }

  _renderLocationSection() {


    return (
      <div className={'container'} style={styles.section}>
        <h2 style={styles.header}>Office Location</h2>
        <h3 style={styles.sub_header}>Qatar Science & Technology Park</h3>
        <div className={'row justify-content-center'}>
          <div className={'col-md-6 col-12'}>
            <div style={styles.location_card}>
              <div style={styles.qstp}></div>
              {/* <img src={this._qstp} style={styles.qstp}
                alt={'Qatar Science & Technology Park'} /> */}
            </div>
          </div>
          <div className={'col-md-6 col-12'}>
            {/* <div style={styles.location_card}>
              <img src={this._qstp} alt={'Qatar Science & Technology Park'} />
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div style={styles.contentDiv}>
        <PageTopBanner title={this._title}
          imageUrl={this._banner_img}/>
        {this._renderFoundersSection()}
        {this._renderLocationSection()}
      </div>
    );
  }
}

const styles = {
  contentDiv: {
    minHeight: '100vh',
    background: '#000000',
    color: 'white'
  },
  header: {
    textAlign: 'center',
    fontWeight: 'lighter',
    fontSize: 48,
    marginBottom: 20
  },
  sub_header: {
    textAlign: 'center',
    fontWeight: 'lighter',
    fontSize: 32,
  },
  section: {
    paddingTop: 30,
    paddingBottom: 80,
  },
  location_card: {
    // margin: 20,
    // overflow: 'hidden'
  },
  qstp: {
    backgroundImage: 'url(\'' + require('../../assets/images/qstp.jpg') + '\')',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'calc(50% + 20px) 50%',
    height: '100%'
  }
};
