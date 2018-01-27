/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

type PropsType = {
    text: string,
};

type StateType = {
};

class StackHeader extends React.Component<PropsType, StateType> {

    render() {
        const { text } = this.props;

        return (
            <div style={styles.text}>
                {text}
                <div style={styles.bar}>
                </div>
            </div>
        );
    }
}

const styles = {
    text: {
        fontSize: 17,
        color: '#FFFFFF',
        height: 50,
        fontWeight: 'lighter',
    },
    bar: {
        height: 1,
        marginTop: 5,
        backgroundColor: '#BA3737',
        width: 50,
    },
};

export { StackHeader };
