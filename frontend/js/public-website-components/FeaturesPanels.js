/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';

import { Link } from 'react-router-dom';

import css from '../../css/public_website/FeaturesPanels.css';

type PropsType = {
  expanded?: boolean,
};

type StateType = {
  top_offset: number
};

type PanelType = {
  name: string,
  image: number,
  link: string
};

class FeaturesPanels extends React.Component<PropsType, StateType> {

  static defaultProps = {
    expanded: true,
  };

  state = {
    top_offset: -10
  }

  _expanded_height: string = 600;
  _collapsed_height: number = 150;

  _parallax_offset_movement_range: number = 50;

  _bound_handleScroll = (e: Event): null => this.handleScroll(e);

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

  componentDidMount() {
    window.addEventListener('scroll', this._bound_handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._bound_handleScroll);
  }

  handleScroll(e: Event) {
    /* get dom element to calculate distance from top and height */
    const dom_element = ReactDOM.findDOMNode(this).getBoundingClientRect();

    /* get page height */
    const page_height: number = document.body.scrollHeight;

    /* get current scroll location */
    const scroll: number = document.documentElement.scrollTop;

    /* calculate dom element distance from bottom of window  */
    const top: number = dom_element.top + scroll - window.innerHeight;

    /* calculate dom element distance from bottom */
    const bottom: number = scroll + dom_element.top + dom_element.height;

    /* check if dom element shows in window */
    if (scroll > top && (scroll < bottom)) {

      var top_offset: number = 0;

      if (page_height - bottom > window.innerHeight) {
        top_offset = (scroll - top) / (window.innerHeight + dom_element.height);
      }

      else {
        top_offset = (scroll - top) / (page_height - bottom + dom_element.height);
      }

      top_offset = (top_offset * this._parallax_offset_movement_range) -
        (this._parallax_offset_movement_range);

      this.setState({
        top_offset
      });
    }
  }

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
    const { top_offset } = this.state;

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
        <img className={'panel-image'} src={panel.image}
          style={{top: top_offset.toString() + '%'}} />
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
        style={{...styles.container, ...container_style}}>
        {panels}
      </div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: '#000000'
  }
};

module.exports = FeaturesPanels;
