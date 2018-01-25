/* @flow */

import React from 'react';

type PropsType = {
  founder: {
    name: string,
    text: string,
    email: string,
    image: number
  }
};

type StateType = {};

class FounderCard extends React.Component<PropsType, StateType> {

  render() {
    const { founder } = this.props;

    return (
      <div className={'col-lg-4 col-md-6 col-8'} style={styles.container}>
        <div styles={styles.card}>
          <img src={founder.image} alt={founder.name} style={styles.image}/>
          <div style={styles.details}>
            <h4 style={styles.name}>{founder.name}</h4>
            <p style={styles.text}>{founder.text}</p>
            <a style={styles.email} href={'mailto:' + founder.email}>{founder.email}</a>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    textAlign: 'center',
    padding: 30
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
    fontWeight: 'lighter'
  }
};

module.exports = FounderCard;
