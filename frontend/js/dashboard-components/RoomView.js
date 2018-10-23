/* @flow */

import * as React from 'react';

import { connect as ReduxConnect } from 'react-redux';

import * as APITypes from '../js-api-utils/APITypes';

import type { GroupType } from '../js-api-utils/ConfigManager'

import HotelControls from './HotelControls';

function mapStateToProps(state) {
    return {
        roomsGroups: state.connection.roomsGroups,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

type PropsType = {
    isSummary: boolean,
    room: APITypes.Room,
    roomsGroups: {[roomId: string]: Array<GroupType>},
};

type StateType = {
};

class RoomViewBase extends React.Component<PropsType, StateType> {

    renderGroupsFull(groups: Array<GroupType>) {
        return groups.map((g, i) => <p key={'group-'+i}>{ g.name }</p> );
    }

    renderGroupsSummary(groups: Array<GroupType>) {
        const { room } = this.props;
        var roomId = room.identifier;
        var roomThings = [];
        for (var i = 0; i < groups.length; i++) {
            for (var j = 0; j < groups[i].things.length; j++) {
                const thing = groups[i].things[j];
                switch (thing.category) {
                    case 'hotel_controls':
                        roomThings.push(
                            <HotelControls id={thing.id} room={room} roomId={roomId} key={'hotel-controls-'+i} />
                        );
                        break;
                    case 'hotel_orders':
                        roomThings.push(<div key={'hotel-orders-'+i} >{thing.name}</div>);
                        break;
                    case 'hotel_diagnostics':
                        roomThings.push(<div key={'hotel-diagnostics-'+i}>{thing.id}</div>);
                        break;
                }
            }
        }
        return roomThings;
    }

    renderSummary() {
        const { room, roomsGroups } = this.props;

        return (
            <div>
                <h4>Summary</h4>
                { roomsGroups && roomsGroups[room.identifier] ? this.renderGroupsSummary(roomsGroups[room.identifier]) : null }
            </div>
        );
    }

    renderFull() {
        const { room, roomsGroups } = this.props;

        return (
            <div>
                <h4>Full</h4>
                { roomsGroups && roomsGroups[room.identifier] ? this.renderGroupsFull(roomsGroups[room.identifier]) : null }
            </div>
        );
    }

    render() {
        return this.props.isSummary ? this.renderSummary() : this.renderFull();
    }
};

const styles = {
    container: {
        display: 'flex',
        flex: 1,
    },
    subroom: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    }
};



export const RoomView = ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomViewBase);
