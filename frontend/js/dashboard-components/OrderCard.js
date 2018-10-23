/* @flow */

import * as React from 'react';

import { connect as ReduxConnect } from 'react-redux';
import * as UIStateActions from './redux/actions/uistate';

import type { OrderType } from '../js-api-utils/ConfigManager'

function mapStateToProps(state) {
    return {};
};

function mapDispatchToProps(dispatch) {
    return {};
};

type PropsType = {
    order: OrderType,
};

type StateType = {
};

class OrderCardBase extends React.Component<PropsType, StateType> {

    render() {
        const { order } = this.props;

        return (
            <div style={styles.orderContainer}>

            </div>
        )
    }
}

const styles = {
    orderContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderCard: {
        width: 200,
        height: 200,
        borderRadius: 15,
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        display: 'flex',
        flexDirection: 'column',
    },
    orderCardContent: {
        display: 'flex',
        flexDirection: 'column',
        flex: 3,

        borderRadius: 15,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,

        backgroundColor: 'rgba(250, 250, 250, 0.4)',
        padding: 10,
    },
    orderCardTitle: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,

        borderRadius: 15,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,

        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(250, 250, 250, 0.4)',
    },
    orderCardSeparator: {
        width: '80%',
    },
};

export const OrderCard = ReduxConnect(mapStateToProps, mapDispatchToProps) (OrderCardBase);
