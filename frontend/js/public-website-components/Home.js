/* @flow */

import React, { Component } from 'react';

import { RoomDemoComponent } from './RoomDemoComponent';
const RequestDemoButton = require('./RequestDemoButton');
const RequestDemoModal = require('./RequestDemoModal');

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
      console.log('open modal');
      const { modal_open } = this.state;

      this.setState({
        modal_open: !modal_open
      });
    }

    render() {
      const { modal_open } = this.state;

        return (
            <div>
              <RoomDemoComponent />
            </div>
        )
    };
};
