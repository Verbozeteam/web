/* @flow */

import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import { connect as ReduxConnect } from 'react-redux';
import { AppWrapper } from './redux/store';

import css from '../../css/public_website/App.css';

import { RoomDemoComponent } from './RoomDemoComponent';

import { Helmet } from 'react-helmet';

type PropsType = {};
type StateType = {};

class TechCrunchBattlefield extends Component<PropsType, StateType> {

  render() {
    return (
      <div style={{height: '100%'}}>
        <Helmet>
          <title>Verboze | TechCrunch Battlefield</title>
        </Helmet>
        <RoomDemoComponent showControls={false} />
      </div>
    );
  }
}

module.exports = {
  TechCrunchBattlefield: AppWrapper(withRouter(ReduxConnect(() => {return {}}, () => {return {}}) (TechCrunchBattlefield)))
}
