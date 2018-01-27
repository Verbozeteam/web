/* @flow */

import React from 'react';
import Radium from 'radium';

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
      <div key="request-demo-button" style={styles.button}>
        <button className="btn" onClick={toggleModal}
          style={styles.button}>
          REQUEST DEMO
        </button>
      </div>
    );
  }

  render() {
    return (
      <div style={{ backgroundColor: 'black' }}>
        <div className='container container-fluid'>
          <div className='row justify-content-around' style={styles.container}>
            <div className='col-lg-6 col-md-8 col-12'>
              <h2 style={styles.header}>See Verboze in action at your Hotel.</h2>
            </div>
            <div className='col-lg-4 col-md-4 col-12'>
              {this._renderButton()}
            </div>
          </div>
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
    borderColor: '#BA3737',
    height: 45,
    width: 220,
    display: 'block',
    margin: '0 auto',
    borderRadius: 0,
    fontWeight: 'lighter',

    WebkitTransition: 'background-color 150ms linear',
    MozTransition: 'background-color 150ms linear',
    Otransition: 'background-color 150ms linear',
    msTransition: 'background-color 150ms linear',
    transition: 'background-color 150ms linear',


    ':hover': {
      backgroundColor: '#BA3737',
      cursor: 'pointer',
    }
  },
  header: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'lighter'
  }
};

module.exports = Radium(RequestDemoBanner);
