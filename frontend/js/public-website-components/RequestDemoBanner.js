/* @flow */

import React from 'react';

const RequestDemoButton = require('./RequestDemoButton');

type PropsType = {
  toggleModal: () => null
};

type StateType = {};

class RequestDemoBanner extends React.Component<PropsType, StateType> {

  static defaultProps = {
    toggleModal: () => null
  };

  _renderButton() {
    const { toggleModal } = this.props;

    return (
      <div style={styles.button_container}>
        <button onClick={toggleModal}
          style={styles.button}>
          REQUEST DEMO
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className='row justify-content-around' style={styles.container}>
        <div className='col-lg-6 col-md-8 col-12'>
          <h2 style={styles.header}>See how Verboze can benefit you!</h2>
        </div>
        <div className='col-lg-4 col-md-4 col-12'>
          {this._renderButton()}
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    backgroundColor: '#000000',
    paddingTop: 70,
    paddingBottom: 70
  },
  wrapper: {
    display: 'block',
    verticalAlign: 'middle'
  },
  button: {
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderWidth: 2,
    borderColor: '#D04F4C',
    height: 45,
    width: 220,
    display: 'block',
    margin: '0 auto'
  },
  header: {
    color: '#FFFFFF',
    textAlign: 'center',
  }
};

module.exports = RequestDemoBanner;
