/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';

import { Link } from 'react-router-dom';

import css from '../../css/public_website/FeaturesPanels.css';

export type PanelType = {
  name: string,
  image: number,
  link: string
};

type PropsType = {
  panels: Array<PanelType>,
  expanded?: boolean,
};

type StateType = {};

export default class FeaturesPanels extends React.Component<PropsType, StateType> {

  static defaultProps = {
    expanded: true,
  };

  _expanded_height: string = 600;
  _collapsed_height: number = 150;
  _collapsed_parallax_offset: number = -150;

  _parallax_offset_movement_range: number = 50;
  _parallax_objects = [];

  _bound_handleScroll = (e: Event): null => this.handleScroll(e);

  componentDidMount() {
    window.addEventListener('scroll', this._bound_handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this._bound_handleScroll);
  }

  handleScroll(e: Event) {
    const { expanded } = this.props;

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

      top_offset = ((top_offset * this._parallax_offset_movement_range) -
        (this._parallax_offset_movement_range));

      if (!expanded) {
        top_offset += this._collapsed_parallax_offset;
      }

      top_offset = top_offset.toString() + '%';

      /* apply style to parallax objects */
      for (var i = 0; i < this._parallax_objects.length; i++) {
        this._parallax_objects[i].style.top = top_offset;
      }
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
        <img ref={(element) => (element) ? this._parallax_objects.push(element) : null}
          className={'panel-image'} src={panel.image} />
        <div className={'overlay'}></div>
        {this._renderHeader(panel.name)}
      </Link>
    );
  }

  render() {
    const { expanded, panels } = this.props;

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
        {panels.map((p, i) => this._renderPanel(i, p))}
      </div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: '#000000'
  }
};

