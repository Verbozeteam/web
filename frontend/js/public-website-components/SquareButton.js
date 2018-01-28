/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

type PropsType = {
    children?: any,
    onClick?: () => null,
    extraStyle?: Object,
};

type StateType = {
};

class SquareButtonImpl extends React.Component<PropsType, StateType> {
    static defaultProps = {
        extraStyle: {},
    };

    render() {
        const { children, onClick, extraStyle } = this.props;

        return (
            <button className="btn" onClick={onClick}
                style={{...styles.style, ...extraStyle}}>
                {children}
            </button>
        );
    }
}

const styles = {
    style: {
        color: '#FFFFFF',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 2,
        borderColor: '#BA3737',
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
};

module.exports = {
    SquareButton:  Radium(SquareButtonImpl)
};
