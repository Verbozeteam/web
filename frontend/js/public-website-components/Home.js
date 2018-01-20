/* @flow */

import React, { Component } from 'react';

import { RoomDemoComponent } from './RoomDemoComponent';

import { Link } from 'react-router-dom';

type PropsType = {
};

type StateType = {
};

export default class Home extends Component<PropsType, StateType> {
    _white_image = require('../../assets/images/white-image.png');
    _technology_complements_luxury = require('../../assets/images/technology_complements_luxury.gif');

    _insights = require('../../assets/images/insights.gif');
    _seamless_exp = require('../../assets/images/seamless_experience.gif');

    render() {
        return (
            <div>
                <RoomDemoComponent />
            </div>
        )
    };
};
