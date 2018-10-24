/* @flow */

import * as React from 'react';

import { connect as ReduxConnect } from 'react-redux';

import type { Room } from '../js-api-utils/APITypes';
import type { GroupType } from '../js-api-utils/ConfigManager';

import { HotelOrders } from './HotelOrders';

import { Colors } from '../constants/Styles';


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

    renderHeader(num_room_orders: number) {
        num_room_orders = 0;

        if (num_room_orders > 99) {
            num_room_orders = '99+'
        }

        return (
            <div style={styles.headerContainer}>
                {(num_room_orders) ?
                    <React.Fragment>
                        <span style={styles.headerNumber}>{`${num_room_orders}`}</span>
                        <span style={styles.header}>&nbsp;Room Orders</span>
                    </React.Fragment>
                : <React.Fragment>
                    <span style={styles.headerNumber}>&nbsp;</span>
                    <span style={styles.header}>Room Orders</span>
                </React.Fragment>}
            </div>
        );
    }

    renderNoRoomOrdersMessage() {
        return (
            <div style={styles.messageContainer}>
                <p style={styles.messageHeader}>
                    No Room Orders
                </p>
                <p style={styles.messageText}>
                    New room orders will appear here
                </p>
            </div>
        );
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
            <div style={styles.container}>
                {this.renderHeader(allRoomThings.length)}
                {allRoomThings}
            </div>
        );
    }
};

const styles = {
    container: {
        paddingLeft: 40,
        paddingRight: 40,
        display: 'flex',
        flexDirection: 'column',
        // height: '100%'
    },
    ordersRow: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        maxHeight: 260,
        minHeight: 230,
    },
    headerContainer: {
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 30,
    },
    header: {
        padding: 0,
        margin: 0,
        color: Colors.white,
        fontSize: 42,
    },
    headerNumber: {
        padding: 0,
        margin: 0,
        color: Colors.white,
        fontSize: 60,
    },
    messageContainer: {
        padding: 0,
        margin: 0,
        display: 'flex',
        flex: 1,
        marginBottom: 40,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    messageHeader: {
        color: Colors.not_so_light_gray,
        fontSize: 36,
        fontWeight: 'medium',
        fontStyle: 'italic',
    },
    messageText: {
        color: Colors.not_so_light_gray,
        fontSize: 22,
        fontWeight: 'medium',
        fontStyle: 'italic'
    }
}

export const OrdersContent = ReduxConnect(mapStateToProps, mapDispatchToProps) (OrdersContentBase);
