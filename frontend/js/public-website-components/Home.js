/* @flow */

import React, { Component } from 'react';

import { RoomDemoComponent } from './RoomDemoComponent';
const RequestDemoModal = require('./RequestDemoModal');
const RequestDemoBanner = require('./RequestDemoBanner');

import HotelFeaturesPanels from './HotelFeaturesPanels';

import { Link } from 'react-router-dom';

type PropsType = {
};

type StateType = {
  modal_open: boolean
};

export default class Home extends Component<PropsType, StateType> {
    _white_image = require('../../assets/images/white-image.png');
    _technology_complements_luxury = require('../../assets/images/technology_complements_luxury.gif');

    _insights = require('../../assets/images/insights.gif');
    _seamless_exp = require('../../assets/images/seamless_experience.gif');

    state = {
      modal_open: false
    };

    toggleModal() {
      const { modal_open } = this.state;

      this.setState({
        modal_open: !modal_open
      });
    }

    render() {
      const { modal_open } = this.state;

        return (
            <div style={{height: '100%'}}>
              <RequestDemoModal open={modal_open}
                toggle={this.toggleModal.bind(this)} />
              <RoomDemoComponent />

              <RequestDemoBanner toggleModal={this.toggleModal.bind(this)} />

              <div style={styles.featuresHeader}>For Hotels</div>
              <HotelFeaturesPanels expanded={true} />

              <br />
              <br />
              <br />
              <div style={styles.featuresHeader}>For Homes</div>
              <HotelFeaturesPanels expanded={true} />
            </div>
        )
    };
};

const styles = {
  featuresHeader: {
    fontSize: 60,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'lighter',
    margin: 30,
  }
};
