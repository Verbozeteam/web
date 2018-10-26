/* @flow */

import * as React from 'react';

import { connect as ReduxConnect } from 'react-redux';
import { setRoomsGroups } from './redux/actions/connection';

import type { Room } from '../js-api-utils/APITypes.js'
import { RoomWindow } from './RoomWindow';
import { RoomCard } from './RoomCard';

import { RoomConfigManager } from '../js-api-utils/RoomsConfigManager';
import type { GroupType, ConfigType } from '../js-api-utils/ConfigManager'

import { Colors } from '../constants/Styles';

import css from '../../assets/dashboard_css/RoomsContent.css';

type PropsType = {
    rooms: {[roomId: string]: Room},
    roomsGroups: {[roomId: string]: Array<GroupType>},
    selectedRoomId: string,
    setRoomsGroups: (setRoomsGroups: {[roomId: string]: Array<GroupType>}) => {}
};

type StateType = {
    search_query: string,
    minimized_floors: Array<number>
};

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

    state: StateType = {
        search_query: '',
        minimized_floors: []
    };

    _search = require('../../assets/dashboard_images/search.png');
    _arrow_down = require('../../assets/dashboard_images/arrow_down.png');

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

    onSearchUpdate(event) {
        this.setState({
            search_query: event.target.value
        });
    }

    renderSearchBar() {
        const { search_query } = this.state;

        return (
            <div style={styles.searchContainer}>
                <img style={styles.searchIcon} src={this._search} />
                <input className={'search-input'}
                    placeholder={'Search room number or occupant'}
                    value={search_query}
                    onChange={this.onSearchUpdate.bind(this)}
                    style={styles.searchInput} />
            </div>
        );
    }

    toggleHideFloor(floor: number) {
        var { minimized_floors } = this.state;

        if (minimized_floors.indexOf(floor) !== -1) {
            minimized_floors = minimized_floors.filter(e => e !== floor);
            this.setState({
                minimized_floors
            });
        } else {
            minimized_floors.push(floor);
            this.setState({
                minimized_floors
            });
        }
    }

    renderFloor(floor: number, rooms: Array<Room>) {
        const { minimized_floors } = this.state;

        const minimized = minimized_floors.indexOf(floor) !== -1;

        return (
            <div key={'floor-' + floor}>
                <div style={styles.header}>
                    <div style={styles.floorHeader}>
                        <span style={styles.floorHeaderNumber}>{floor}</span>
                        <span style={styles.floorHeader}>th Floor</span>
                    </div>
                    <div style={styles.hide}
                        onClick={() => this.toggleHideFloor(floor)}>
                        <span style={styles.hideText}>{(minimized) ? 'Show' : 'Hide'}</span>
                        <img style={(minimized) ? styles.showChevron : styles.hideChevron}
                            src={this._arrow_down} />
                    </div>
                </div>
                {(!minimized) ? <div className="row">{rooms}</div> : null}
                <hr style={styles.floorDivider} />
            </div>
        );
    }

    renderRoomsGrid() {
        const { rooms } = this.props;
        const { search_query } = this.state;

        const floors = {};
        for (var roomId in rooms) {
            const room = <RoomCard key={'room-card-' + roomId}
                    room={rooms[roomId]} />;

            const floor = rooms[roomId].floor;
            if (floor in floors) {
                floors[floor].push(room);
            } else {
                floors[floor] = [room];
            }
        }

        const rendered_floors = [];
        for (var floor in floors) {
            rendered_floors.push(this.renderFloor(floor, floors[floor]));
        }

        return (
            <React.Fragment>
                {rendered_floors}
            </React.Fragment>
        );
    }

    renderSelectedRoom() {
        const { rooms, selectedRoomId } = this.props;

        var selectedRoom = null;

        var roomsIds = Object.keys(rooms);
        for (var i = 0; i < roomsIds.length; i++) {
            var room = rooms[roomsIds[i]];
            if (room.id == selectedRoomId)
                selectedRoom = room;
        }

        return <RoomWindow room={selectedRoom} />
    }

    render() {
        const { selectedRoomId } = this.props;

        var rooms_content = null;
        if (selectedRoomId && selectedRoomId != '') {
          rooms_content = this.renderSelectedRoom();
        } else {
          rooms_content = this.renderRoomsGrid();
        }

        return (
            <div style={styles.container}>
                {this.renderSearchBar()}
                {rooms_content}
            </div>
        );
    }
}

const styles = {
    container: {
        paddingRight: 40,
        paddingLeft: 40,
        paddingTop: 40
    },
    roomsRow: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        maxHeight: 260,
        minHeight: 230,
    },
    searchContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 25,
        paddingRight: 25,
        borderRadius: 10,
        backgroundColor: '#7D7D7D',
        overflow: 'hidden',
        height: 50
    },
    searchIcon: {
        height: 19,
        width: 19,
        marginRight: 25,
    },
    searchInput: {
        flex: 1,
        backgroundColor: 'transparent',
        border: 'none',
        color: Colors.white,
        fontSize: 22,
        fontWeight: 'medium'
    },
    floorHeaderNumber: {
        color: Colors.white,
        fontSize: 56,
        fontWeight: 'medium'
    },
    floorHeader: {
        color: Colors.white,
        fontSize: 32,
        fontWeight: 'medium'
    },
    floorDivider: {
        padding: 0,
        margin: 0,
        backgroundColor: Colors.gray,
        marginTop: 40
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    hideText: {
        fontStyle: 'italic',
        fontWeight: 'medium',
        fontSize: 16,
        color: Colors.white,
        marginRight: 10
    },
    showChevron: {
        height: 25,
        width: 25,
        transform: 'rotate(90deg)'
    },
    hideChevron: {
        height: 25,
        width: 25
    },
    hide: {
        cursor: 'pointer'
    }
}

export const RoomsContent = ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomsContentBase);
