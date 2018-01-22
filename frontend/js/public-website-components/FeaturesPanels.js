/* @flow */

import React from 'react';

import css from '../../css/public_website/FeaturesPanels.css';

type PropsType = {
  expanded?: boolean
};

type StateType = {};

type PanelType = {
  name: string,
  image: number
};

class FeaturesPanels extends React.Component<PropsType, StateType> {

  static defaultProps = {
    expanded: true
  };

  _expanded_height: string = 600;
  _collapsed_height: number = 100;

  _panels: Array<PanelType> = [
    {
        name: 'Modernizing Control',
        image: require('../../assets/images/iphone_slice.png')
    },
    {
      name: 'Empowering Guests',
      image: require('../../assets/images/car_slice.png')
    },
    {
      name: 'Enhancing Hotels',
      image: require('../../assets/images/building_slice.png')
    },
    {
      name: 'Choosing Verboze',
      image: require('../../assets/images/iphone_slice.png')
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
      <div className={'header-container'}
        style={styles.header_container}>
          {lines}
      </div>
    );
  }

  _renderPanel(id: number, panel: PanelType) {
    console.log(panel);

    return (
      <div key={'panel-' + id}
        className={'panel'}
        style={{...styles.panel, backgroundColor: panel.color}}>
        <img className={'image'} src={panel.image} />
        <div className={'overlay'}></div>
        {this._renderHeader(panel.name)}
      </div>
    );
  }

  render() {
    const { expanded } = this.props;

    const panels = [];
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
      <div style={{...styles.container, ...container_style}}>
        {panels}
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex'
  },
  panel: {
    position: 'relative',
    padding: 50,
    overflow: 'hidden'
  },
  header_container: {
    marginTop: 100
  }
};

module.exports = FeaturesPanels;
