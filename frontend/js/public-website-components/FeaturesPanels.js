/* @flow */

import React from 'react';

import { Link } from 'react-router-dom';

import css from '../../css/public_website/FeaturesPanels.css';

type PropsType = {
  expanded?: boolean
};

type StateType = {};

type PanelType = {
  name: string,
  image: number,
  link: string
};

class FeaturesPanels extends React.Component<PropsType, StateType> {

  static defaultProps = {
    expanded: true
  };

  _expanded_height: string = 600;
  _collapsed_height: number = 150;

  _panels: Array<PanelType> = [
    {
        name: 'Modernizing Control',
        image: require('../../assets/images/iphone_slice.png'),
        link: '/modernizing-control'
    },
    {
      name: 'Empowering Guests',
      image: require('../../assets/images/car_slice.png'),
      link: '/empowering-guests'
    },
    {
      name: 'Enhancing Hotels',
      image: require('../../assets/images/building_slice.png'),
      link: 'enhancing-hotels'
    },
    {
      name: 'Choosing Verboze',
      image: require('../../assets/images/iphone_slice.png'),
      link: 'choosing-verboze'
    }
  ];

  _renderHeader(text: string) {

    const split_lines = text.split(' ');

    const lines = [];
    for (var i = 0; i < split_lines.length; i++) {
      lines.push(
        <h4 key={'line-' + split_lines[i] + '-' + i}
          className={'header'}>{split_lines[i]}</h4>
      );
    }

    return (
      <div className={'header-container'}>
          {lines}
      </div>
    );
  }

  _renderPanel(id: number, panel: PanelType) {
    const { expanded } = this.props;

    var class_name = 'panel ';
    if (expanded) {
      class_name += 'expanded';
    } else {
      class_name += 'collapsed';
    }

    return (
      <Link key={'panel-' + id}
        to={panel.link}
        className={class_name}>
        <img className={'panel-image'} src={panel.image} />
        <div className={'overlay'}></div>
        {this._renderHeader(panel.name)}
      </Link>
    );
  }

  render() {
    const { expanded } = this.props;

    const panels = [];
    const x_offset = 1 / this._panels.length * 100;
    for (var i = 0; i < this._panels.length; i++) {
      panels.push(this._renderPanel(i, this._panels[i]));
    }

    /* create container style */
    var container_style = {};
    if (expanded) {
      container_style.height = this._expanded_height;
    } else {
      container_style.height = this._collapsed_height;
    }

    return (
      <div className={'panels-container'}
        style={container_style}>
        {panels}
      </div>
    );
  }
}

module.exports = FeaturesPanels;
