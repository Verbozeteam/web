/* @flow */

import * as React from 'react';
import { connect as ReduxConnect } from 'react-redux';
import * as connectionActions from './redux/actions/connection';

import { RoomConfigManager } from '../js-api-utils/RoomsConfigManager';

import OrderCard from './OrderCard';

import type { ThingMetadataType, ThingStateType, GroupType, OrderType } from '../js-api-utils/ConfigManager';

import type { Room } from '../js-api-utils/APITypes';

import { Colors } from '../constants/Styles';


type PropsType = {
    roomId: string,
    orders: Array<OrderType>,
    setRoomOrders: (roomId: string, orders: Array<OrderType>) => {}
};

type StateType = {};

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        setRoomOrders: (roomId: string, orders: Array<OrderType>) =>
            dispatch(connectionActions.setRoomOrders(roomId, orders))
    };
}

class RoomOrdersBase extends React.Component<PropsType, StateType> {
    _unsubscribe: () => any = () => null;

    componentWillReceiveProps(newProps: PropsType) {
        const { setRoomOrders } = this.props;

        setRoomOrders(newProps.roomId, newProps.orders);
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    dismissOrder(orderId) {
        const { roomId } = this.props;

        RoomConfigManager.getConfigManager(roomId).setThingState('hotel_orders', {
            'resolve_order': orderId
        }, true);
    }

    renderOrders(orders: Array<OrderType>) {
        return orders.map((order) => (
            <OrderCard key={'order' + order.id}
                order={order}
                dismiss={this.dismissOrder.bind(this)} />
        ));
    }

    renderHeader() {
        const { roomId } = this.props;

        return (
            <div style={styles.headerContainer}>
                <p style={styles.roomName}>{`Room #${roomId}`}</p>
                <p style={styles.guestName}>Yahya Alhomsi</p>
            </div>
        );
    }

    render() {
        const { roomId, orders } = this.props;

        if (orders.length == 0) {
            return null;
        }

        return (
            <div style={styles.container}>
                {this.renderHeader()}
                {this.renderOrders(orders)}
            </div>
        );
    }
}

const styles = {
    container: {
        margin: 0,
        padding: 0,
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.25)',
        marginBottom: 40
    },
    headerContainer: {
        height: 60,
        paddingLeft: 20,
        paddingRight: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.red
    },
    roomName: {
        padding: 0,
        margin: 0,
        color: Colors.white,
        fontSize: 22,
        fontWeight: 'bold'
    },
    guestName: {
        padding: 0,
        margin: 0,
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'medium'
    }
}

export const RoomOrders = ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomOrdersBase);
