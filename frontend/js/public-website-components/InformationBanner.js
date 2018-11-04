/* @flow */

import React from 'react';

type PropsType = {};
type StateType = {};

export default class InformationBanner extends React.Component<PropsType, StateType> {
    render() {
        return (
          <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className='container container-fluid'>
              <div className='row justify-content-around' style={styles.container}>
                <div className='col'>
                  <h2 style={styles.header}>Hotels face a lot of barriers when adopting new technologies, we're here to change that.</h2>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

const styles = {
  container: {
    paddingTop: 70,
    paddingBottom: 70
  },
  header: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'lighter'
  }
}