/* @flow */

import React from 'react';

import { SquareButton } from './SquareButton';

type PropsType = {
  toggleModal: () => null
};

type StateType = {};

class RequestDemoBanner extends React.Component<PropsType, StateType> {

  static defaultProps = {
    toggleModal: () => null
  };

  render() {
    const { toggleModal } = this.props;

    return (
      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div className='container container-fluid'>
          <div className='row justify-content-around' style={styles.container}>
            <div className='col-lg-6 col-md-8 col-12'>
              <h2 style={styles.header}>See Verboze in action</h2>
            </div>
            <div className='col-lg-4 col-md-4 col-12'>
              <SquareButton onClick={toggleModal} extraStyle={{height: 45, width: 220}}>
                REQUEST A DEMO
              </SquareButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    marginTop: 30,
    marginBottom: 30,
    paddingTop: 70,
    paddingBottom: 70
  },
  wrapper: {
    display: 'block',
    verticalAlign: 'middle'
  },
  header: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'lighter'
  }
};

module.exports = RequestDemoBanner;
