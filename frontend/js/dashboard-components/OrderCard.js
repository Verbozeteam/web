/* @flow */

import * as React from 'react';

import { Colors } from '../constants/Styles';

import type { OrderType } from '../js-api-utils/ConfigManager';

type PropsType = {
    order: OrderType,
    dismiss: () => {}
};

type StateType = {
    hoveringOverDismissButton: boolean,
};

export default class OrderCardBase extends React.Component<PropsType, StateType> {

    state = {
        hoveringOverDismissButton: false
    }

    hoverOn() {
        this.setState({
            hoveringOverDismissButton: true
        })
    }

    hoverOff() {
        this.setState({
            hoveringOverDismissButton: false
        })
    }

    render() {
        const { order, dismiss } = this.props;
        const { hoveringOverDismissButton } = this.state;

        return (
            <div style={styles.container}>
                <p style={styles.title}>{order.name}</p>
                <hr style={styles.divider} />
                <div style={styles.dismissButtonContainer}>
                    <button
                        style={{ ...styles.dismissButton, backgroundColor: hoveringOverDismissButton ? Colors.background_close_button_hovering : Colors.background_close_button }}
                        onMouseEnter={this.hoverOn.bind(this)}
                        onMouseLeave={this.hoverOff.bind(this)}
                        onClick={() => dismiss(order.id)}>
                        Dismiss
                    </button>
                </div>
            </div>
        )
    }
}

const styles = {
    container: {
        backgroundColor: Colors.off_white,
        margin: 0,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 15,
        paddingBottom: 15,
        borderTop: `1px solid ${Colors.light_gray}`
    },
    title: {
        padding: 0,
        margin: 0,
        fontSize: 22,
        fontWeight: 'medium',
        color: Colors.blackish
    },
    divider: {
        padding: 0,
        margin: 0,
        backgroundColor: Colors.light_gray,
        marginTop: 10,
        marginBottom: 10
    },
    dismissButtonContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    dismissButton: {
        color: Colors.red,
        height: 30,
        // fontSize: 18,
        // fontWeight: 'medium',
        borderRadius: 3,
        paddingRight: 40,
        paddingLeft: 40,
        border: 'none',
        cursor: 'pointer'
    }
}
