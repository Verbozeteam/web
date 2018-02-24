/* @flow */

import React from 'react';

import PageTopBanner from './PageTopBanner';
const RequestDemoModal = require('./RequestDemoModal');
const RequestDemoBanner = require('./RequestDemoBanner');
const FounderCard = require('./FounderCard');

import { Link } from 'react-router-dom';

type PropsType = {};
type StateType = {
  modal_open: boolean
};

export default class Company extends React.Component<PropsType, StateType> {
  _banner_img = require('../../assets/images/company_banner.jpg');
  _title: string = '';
  _qstp: string = require('../../assets/images/qstp.jpg');
  _google_maps: string = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.3732234493864!2d51.435260451148345!3d25.325254183757377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45dc1b48888243%3A0xc99991c5589f3b25!2sQatar+Science+and+Technology+Park!5e0!3m2!1sen!2sus!4v1486423672733';

  _founders: Array<Object> = [
    {
      name: 'Hasan Al-Jawaheri',
      text: 'Co-Founder | CEO',
      email: 'hbj@verboze.com',
      linkedin: 'https://www.linkedin.com/in/hasan-al-jawaheri/',
      image: require('../../assets/images/hasan.jpg')
    },
    {
      name: 'Mohammed M. Fituri',
      text: 'Co-Founder',
      email: 'mfituri@verboze.com',
      linkedin: 'https://www.linkedin.com/in/mfituri/',
      image: require('../../assets/images/fituri.jpg')
    },
    {
      name: 'Yusuf Musleh',
      text: 'Co-Founder',
      email: 'ymusleh@verboze.com',
      linkedin: 'https://www.linkedin.com/in/yusufmusleh/',
      image: require('../../assets/images/yusuf.jpg')
    }
  ];

  state = {
    modal_open: false
  };

  toggleModal() {
    const { modal_open } = this.state;

    this.setState({
      modal_open: !modal_open
    });
  }


  _renderFoundersSection() {

    const founders = [];
    for (var i = 0; i < this._founders.length; i++) {
      founders.push(
        <FounderCard key={'founder-' + i}
          founder={this._founders[i]} />
      );
    }

    return (
      <div className={'container'} style={styles.section} id="executive-team">
        <h2 style={styles.header}>Executive Team</h2>
        <div className={'row justify-content-center'}>
          {founders}
        </div>
      </div>
    );
  }

  _renderLocationSection() {

    return (
      <div className={'container'} style={styles.section} id="office-location">
        <h2 style={styles.header}>Office Location</h2>
        <h3 style={styles.sub_header}>Qatar Science & Technology Park</h3>
        <div className={'row justify-content-center'}>
          <div className={'col-md-6 col-12'} style={styles.location_card}>
            <div style={styles.qstp}></div>
          </div>
          <div className={'col-md-6 col-12'} style={styles.location_card}>
            <iframe style={styles.google_maps}
              src={this._google_maps}></iframe>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { modal_open } = this.state;

    return (
      <div style={styles.contentDiv}>
        <RequestDemoModal open={modal_open}
          toggle={this.toggleModal.bind(this)} />
        <PageTopBanner title={this._title}
          imageUrl={this._banner_img}/>
        {this._renderFoundersSection()}
        {this._renderLocationSection()}
        <RequestDemoBanner toggleModal={this.toggleModal.bind(this)} />
      </div>
    );
  }
}

const styles = {
  contentDiv: {
    height: '100%',
    color: 'white'
  },
  header: {
    textAlign: 'center',
    fontWeight: 'lighter',
    fontSize: 48,
    marginTop: 20,
    marginBottom: 20
  },
  sub_header: {
    textAlign: 'center',
    fontWeight: 'lighter',
    fontSize: 32,
    marginTop: -10,
    marginBottom: 20
  },
  section: {
    paddingTop: 30,
    paddingBottom: 70
  },
  location_card: {
    height: 350,
    padding: 30
  },
  google_maps: {
    height: '100%',
    width: '100%',
    border: 'none'
  },
  qstp: {
    backgroundImage: 'url(\'' + require('../../assets/images/qstp.jpg') + '\')',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'calc(50% + 13px) 50%',
    height: '100%'
  }
};
