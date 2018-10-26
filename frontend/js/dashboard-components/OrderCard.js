/* @flow */

import * as React from 'react';

import { Colors } from '../constants/Styles';

type PropsType = {
    order: OrderType,
    dimiss: () => {}
};

type StateType = {};

export default class OrderCardBase extends React.Component<PropsType, StateType> {

    render() {
        const { order, dismiss } = this.props;

        return (
            <div style={styles.container}>
                <p style={styles.title}>{order.name}</p>
                <hr style={styles.divider} />
                <div style={styles.dismissButtonContainer}>
                    <button style={styles.dismissButton}
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
        backgroundColor: `${Colors.red}33`,
        color: Colors.red,
        height: 30,
        // fontSize: 18,
        // fontWeight: 'medium',
        borderRadius: 3,
        paddingRight: 40,
        paddingLeft: 40,
        border: 'none'
    }
}

// const styles = {
//     orderContainer: {
//         display: 'flex',
//         flex: 1,
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     orderCard: {
//         width: 200,
//         height: 200,
//         borderRadius: 15,
//         boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
//         display: 'flex',
//         flexDirection: 'column',
//     },
//     orderCardContent: {
//         display: 'flex',
//         flexDirection: 'column',
//         flex: 3,
//
//         borderRadius: 15,
//         borderBottomLeftRadius: 0,
//         borderBottomRightRadius: 0,
//
//         backgroundColor: 'rgba(250, 250, 250, 0.4)',
//         padding: 10,
//     },
//     orderCardTitle: {
//         display: 'flex',
//         flexDirection: 'column',
//         flex: 1,
//
//         borderRadius: 15,
//         borderTopLeftRadius: 0,
//         borderTopRightRadius: 0,
//
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: 'rgba(250, 250, 250, 0.4)',
//     },
//     orderCardSeparator: {
//         width: '80%',
//     },
// };
