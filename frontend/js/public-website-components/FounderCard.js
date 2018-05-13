/* @flow */

import React from 'react';
import Radium from 'radium';

type PropsType = {
  founder: {
    name: string,
    text: string,
    email: string,
    linkedin: string,
    image: number
  }
};

type StateType = {};

class FounderCard extends React.Component<PropsType, StateType> {

  render() {
    const { founder } = this.props;

    return (
      <div className={'col-lg-3 col-md-6 col-8'} style={styles.container}>
        <div styles={styles.card}>
          <img src={founder.image} alt={founder.name} style={styles.image}/>
          <div style={styles.details}>
            <h4 style={styles.name}>{founder.name}</h4>
            <p style={styles.text}>{founder.text}</p>
            <a style={styles.email} href={'mailto:' + founder.email}>
              <i className={'fa fa-envelope'}></i>&nbsp;&nbsp;{founder.email}</a>
            <br/>
            <a key={'linkedin-' + founder.name} style={styles.linkedin} target={'_blank'} href={founder.linkedin}>
              <i className={'fa fa-linkedin'}></i>&nbsp;&nbsp;LinkedIn
            </a>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    padding: 10
  },
  image: {
    width: '100%'
  },
  details: {
    padding: 20,
    backgroundColor: '#2E2E2E',
    borderTop: '2px #D04F4C solid'
  },
  name: {
    fontSize: 22,
    fontWeight: 'lighter'
  },
  text: {
    fontWeight: 'lighter'
  },
  email: {
    color: '#D04F4C',
    fontWeight: 'lighter',
    textAlign: 'left',
    ':hover': {
      textDecoration: 'none',
      fontWeight: 'normal'
    }
  },
  linkedin: {
    color: '#D04F4C',
    fontWeight: 'lighter',
    textAlign: 'left',
    ':hover': {
      textDecoration: 'none',
      fontWeight: 'normal'
    }
  }
};

module.exports = Radium(FounderCard);
