/* @flow */

import React from 'react';

type PropsType = {
  toggle: () => null
};

type StateType = {};

class RequestDemoButton extends React.Component<PropsType, StateType> {

  static defaultProps = {
    toggle: () => null
  };

  render() {
    const { toggle } = this.props;

    return (
      <button onClick={toggle}
        style={styles.button}>
        REQUEST DEMO
      </button>
    );
  }
}

const styles = {
  button: {
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderWidth: 2,
    borderColor: '#D04F4C',
    height: 45,
    width: 220,
  }
}

module.exports = RequestDemoButton;
