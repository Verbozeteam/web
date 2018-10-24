/* @flow */

import * as React from 'react';
import { connect as ReduxConnect } from 'react-redux';

import { RoomConfigManager } from '../js-api-utils/RoomsConfigManager';
import OrderCard from './OrderCard';

import type { ThingMetadataType, ThingStateType, GroupType, OrderType } from '../js-api-utils/ConfigManager';

import type { Room } from '../js-api-utils/APITypes';

import { Colors } from '../constants/Styles';


type PropsType = {
    id: string,
    roomId: string,
    rooms: {[roomId: string]: Room},
};
type StateType = {
    orders: Array<OrderType>
};

function mapStateToProps(state) {
    return {
        rooms: state.connection.rooms
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

class HotelOrdersBase extends React.Component<PropsType, StateType> {
    _unsubscribe: () => any = () => null;

    state = {
        orders: []
    };

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps: PropsType) {
        this._unsubscribe();
        if (newProps.id && newProps.roomId) {
            this._unsubscribe = RoomConfigManager.getConfigManager(newProps.roomId).registerThingStateChangeCallback(newProps.id, this.onRoomOrdersChanged.bind(this));
            if (newProps.id in RoomConfigManager.getConfigManager(newProps.roomId).things)
                this.onRoomOrdersChanged(RoomConfigManager.getConfigManager(newProps.roomId).thingMetas[newProps.id], RoomConfigManager.getConfigManager(newProps.roomId).things[newProps.id]);
        }
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    onRoomOrdersChanged(meta: ThingMetadataType, roomOrdersState: ThingStateType) {
        console.log('meta:', meta);
        console.log('roomOrdersState:', roomOrdersState);

        /* an order was dismissed */
        if ('resolve_order' in roomOrdersState) {
            var orderId = roomOrdersState['resolve_order'];
            roomOrdersState.orders = roomOrdersState.orders.filter((o) => o.id !== orderId);
        }

        this.setState({
            orders: roomOrdersState.orders
        })
    }

    dismissOrder(orderId) {
        const { roomId } = this.props;

        RoomConfigManager.getConfigManager(roomId).setThingState('hotel_orders', {
            'resolve_order': orderId
        }, true);
    }

    renderOrders2() {
        const { id, roomId, rooms } = this.props;
        const { orders } = this.state;

        return (
            <div>
                <h3>Room: { rooms[roomId].name }</h3>
                { orders.map(o => <div key={'order-'+o.id} onClick={() => this.dismissOrder(o.id)}><h4>{o.name}</h4></div>) }
            </div>
        );
    }

    renderOrders() {
        const { orders } = this.state;

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
                <p style={styles.guestName}>Guest Mc Guest</p>
            </div>
        );
    }

    render() {
        const { orders } = this.state;

        if (orders.length == 0) {
            return null;
        }

        return (
            <div style={styles.container}>
                {this.renderHeader()}
                {this.renderOrders()}
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

export const HotelOrders = ReduxConnect(mapStateToProps, mapDispatchToProps) (HotelOrdersBase);
