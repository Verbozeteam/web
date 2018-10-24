/* @flow */

import * as React from 'react';

import { connect as ReduxConnect } from 'react-redux';
import { setRoomsGroups } from './redux/actions/connection';

import type { Room } from '../js-api-utils/APITypes.js'
import { RoomWindow } from './RoomWindow';
import { RoomCard } from './RoomCard';

import { RoomConfigManager } from '../js-api-utils/RoomsConfigManager';
import type { GroupType, ConfigType } from '../js-api-utils/ConfigManager'

type PropsType = {
    rooms: {[roomId: string]: Room},
    roomsGroups: {[roomId: string]: Array<GroupType>},
    selectedRoomId: string,
    setRoomsGroups: (setRoomsGroups: {[roomId: string]: Array<GroupType>}) => {}
};

type StateType = {};

function mapStateToProps(state) {
    return {
        rooms: state.connection.rooms,
        roomsGroups: state.connection.roomsGroups,
        selectedRoomId: state.uistate.selectedRoomId,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setRoomsGroups: (roomsGroups: {[roomId: string]: Array<GroupType>}) => dispatch(setRoomsGroups(roomsGroups)),
    };
}

class RoomsContentBase extends React.Component<PropsType, StateType> {
    _unsubscribeFuncList: Array<() => any> = [];

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps: PropsType) {
        /* unsubscribe from all old rooms */
        for (var i = 0; i < this._unsubscribeFuncList.length; i++) {
            this._unsubscribeFuncList[i]();
        }
        this._unsubscribeFuncList = [];

        /* subscribe to all new rooms */
        var roomsIds = Object.keys(newProps.rooms);
        for (var i = 0; i < roomsIds.length; i++) {
            var room = newProps.rooms[roomsIds[i]];
            var roomId = room.identifier;
            this._unsubscribeFuncList[i] = RoomConfigManager.getConfigManager(roomId).registerConfigChangeCallback(this.onConfigChanged.bind(this))
            if (RoomConfigManager.getConfigManager(roomId).config) {
                this.onConfigChanged(RoomConfigManager.getConfigManager(roomId).config);
            }
        }
    }

    componentWillUnmount() {
        /* unsubscribe from all rooms */
        for (var i = 0; i < this._unsubscribeFuncList.length; i++) {
            this._unsubscribeFuncList[i]();
        }
        this._unsubscribeFuncList = [];
    }

    onConfigChanged(config: ConfigType) {
        const { roomsGroups, setRoomsGroups } = this.props;

        var roomId = config.id;
        if (config && config.rooms) {
            var newGroups = [];
            for (var r = 0; r < config.rooms.length; r++) {
                var room = config.rooms[r];
                newGroups = newGroups.concat(room.groups);
            }

            if (JSON.stringify(newGroups) != JSON.stringify(roomsGroups[roomId])) {
                roomsGroups[roomId] = newGroups;
                setRoomsGroups(roomsGroups);
            }
        }
    }

    render() {
        const { rooms, roomsGroups, selectedRoomId } = this.props;

        var roomsContent = null;
        if (selectedRoomId && selectedRoomId != "") {
            var selectedRoom = null;


            var roomsIds = Object.keys(rooms);
            for (var i = 0; i < roomsIds.length; i++) {
                var room = rooms[roomsIds[i]];
                if (room.id == selectedRoomId)
                    selectedRoom = room;
            }
            roomsContent = (
                <RoomWindow
                    room={selectedRoom}
                    />
            );
        } else {
            var roomCards = [];
            var roomsIds = Object.keys(rooms);
            for (var i = 0; i < roomsIds.length; i++) {
                var room = rooms[roomsIds[i]];
                roomCards.push(
                    <RoomCard
                        key={'room-view-'+i}
                        room={room}
                        />
                );
            }
            roomsContent = <div className={'row'}>{roomCards}</div>
        }
        return roomsContent;
    }
}

const styles = {
    roomsRow: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        maxHeight: 260,
        minHeight: 230,
    },
}

export const RoomsContent = ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomsContentBase);
