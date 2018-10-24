/* @flow */

import * as React from 'react';
import { connect as ReduxConnect } from 'react-redux';
import * as connectionActions from './redux/actions/connection';

import { RoomConfigManager } from '../js-api-utils/RoomsConfigManager';
import { RoomOrders } from './RoomOrders';

import type { ThingMetadataType, ThingStateType, GroupType, OrderType } from '../js-api-utils/ConfigManager';

import type { Room } from '../js-api-utils/APITypes';

import { Colors } from '../constants/Styles';


type PropsType = {
    id: string,
    roomId: string,
};

type StateType = {
    orders: Array<OrderType>
};

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

class HotelOrdersBase extends React.Component<PropsType, StateType> {
    _unsubscribe: () => any = () => null;

    state: StateType = {
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
        const { roomId, setRoomOrders } = this.props;

        console.log('meta:', meta);
        console.log('roomOrdersState:', roomOrdersState);

        /* an order was dismissed */
        if ('resolve_order' in roomOrdersState) {
            var orderId = roomOrdersState['resolve_order'];
            roomOrdersState.orders = roomOrdersState.orders.filter((o) => o.id !== orderId);
        }

        this.setState({
            orders: roomOrdersState.orders
        });
    }

    render() {
        const { roomId } = this.props;
        const { orders } = this.state;

        return <RoomOrders roomId={roomId}
            orders={orders}/>
    }
}

export const HotelOrders = ReduxConnect(mapStateToProps, mapDispatchToProps) (HotelOrdersBase);
