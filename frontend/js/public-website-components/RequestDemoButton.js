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
    borderWidth: 2,
    borderColor: '#D04F4C',
  }
}

module.exports = RequestDemoButton;
