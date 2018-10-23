/* @flow */

import * as React from 'react';

import { connect as ReduxConnect } from 'react-redux';

import type { Room } from '../js-api-utils/APITypes';
import type { GroupType } from '../js-api-utils/ConfigManager';

import { HotelOrders } from './HotelOrders';

type PropsType = {
    rooms: {[roomId: string]: Room},
    roomsGroups: {[roomId: string]: Array<GroupType>},
};
type StateType = {};

function mapStateToProps(state) {
    return {
        rooms: state.connection.rooms,
        roomsGroups: state.connection.roomsGroups,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

class OrdersContentBase extends React.Component<PropsType, StateType> {

    renderGroups(groups: Array<GroupType>, roomId: string) {;
        var roomThings = [];
        for (var i = 0; i < groups.length; i++) {
            for (var j = 0; j < groups[i].things.length; j++) {
                const thing = groups[i].things[j];
                switch (thing.category) {
                    case 'hotel_controls':
                        break;
                    case 'hotel_orders':
                        roomThings.push(
                            <HotelOrders id={thing.id} roomId={roomId} key={'hotel-controls-'+i} />
                        );
                        break;
                    case 'hotel_diagnostics':
                        break;
                }
            }
        }
        return roomThings;
    }

    render() {
        const { rooms, roomsGroups } = this.props;

        var allRoomThings = [];
        for (var property in roomsGroups) {
            if (roomsGroups.hasOwnProperty(property)) {
                allRoomThings.push(this.renderGroups(roomsGroups[property], property))
            }
        }

        return (
            <div>
                { allRoomThings }
            </div>
        );
    }
};

const styles = {
    ordersRow: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        maxHeight: 260,
        minHeight: 230,
    },
}

export const OrdersContent = ReduxConnect(mapStateToProps, mapDispatchToProps) (OrdersContentBase);
