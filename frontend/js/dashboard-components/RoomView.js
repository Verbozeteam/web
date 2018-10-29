/* @flow */

import * as React from 'react';

import { connect as ReduxConnect } from 'react-redux';

import * as APITypes from '../js-api-utils/APITypes';

import type { GroupType } from '../js-api-utils/ConfigManager'

import HotelControls from './HotelControls';
import RoomDiagnostics from './RoomDiagnostics';

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

    renderRoomThings() {
        const { room, roomsGroups, isSummary } = this.props;

        if (!(roomsGroups && roomsGroups[room.identifier]))
            return null

        var roomId = room.identifier;
        var groups = roomsGroups[roomId];
        var roomThings = [];
        for (var i = 0; i < groups.length; i++) {
            for (var j = 0; j < groups[i].things.length; j++) {
                const thing = groups[i].things[j];
                switch (thing.category) {
                    case 'hotel_controls':
                        roomThings.push(
                            <HotelControls id={thing.id} room={room} isSummary={isSummary} roomId={roomId} key={'hotel-controls-'+i} />
                        );
                        break;
                    case 'room_diagnostics':
                        roomThings.push(
                            <RoomDiagnostics id={thing.id} roomId={roomId} isSummary={isSummary} key={'room-diagnositcs-'+i} />
                        );
                        break;
                }
            }
        }
        return roomThings;

    }

    render() {
        return (
            this.renderRoomThings()
        );
    }
};

export const RoomView = ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomViewBase);
