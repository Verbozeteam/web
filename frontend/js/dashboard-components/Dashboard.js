/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { connect as ReduxConnect } from 'react-redux';
import { STORE, AppWrapper } from "./redux/store";
import * as connectionActions from './redux/actions/connection';

import * as APITypes from '../js-api-utils/APITypes';
import * as ConnectionTypes from '../js-api-utils/ConnectionTypes';
import { DashboardAPICaller } from '../js-api-utils/DashboardAPI';

import { WebSocketCommunication } from '../js-api-utils/WebSocketCommunication';

import { RoomsContent } from './RoomsContent';

import { OrdersContent } from './OrdersContent';

import { RoomConfigManager } from '../js-api-utils/RoomsConfigManager';


function mapStateToProps(state) {
    return {
        rooms: state.connection.rooms,
        selectedRoomId: state.uistate.selectedRoomId,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setRooms: (r: Array<APITypes.Room>) => dispatch(connectionActions.setRooms(r)),
        setConnectionState: (cs: number) => dispatch(connectionActions.setConnectionState(cs)),
        setConfig: (r: string, c: ConnectionTypes.ConfigType) => dispatch(connectionActions.setRoomConfig(r, c)),
        setThingsStates: (r: string, s: Object) => dispatch(connectionActions.setRoomThingsStates(r, s)),
    };
}

type PropsType = {
    ...any,
};

type StateType = {
    ...any,
};

class DashboardBase extends React.Component<PropsType, StateType> {

    createWebsocketURL(token: string): string {
        var protocol = "ws://";
        if (location.protocol === 'https:')
            protocol = "wss://";
        return protocol + location.host + "/stream/" + token + '/';
    }

    fetchRoomsConfigs() {
        const { rooms } = this.props;

        /* @TODO: SEND CODE 0 FOR ALL ROOMS IDS IN A WAY THAT DOESNT SPAM OUR SERVER
        /* ...
        */

        var roomsIds = Object.keys(rooms);
        for (var i = 0; i < roomsIds.length; i++) {
            var room = rooms[roomsIds[i]];
            console.log('sending code 0 to', room);
            WebSocketCommunication.sendMessage({
                code: 0,
                __room_id: room.identifier,
            });
        }
    }

    fetchRooms(token: string) {
        /* Fetch the rooms */
        DashboardAPICaller.setToken(token);
        DashboardAPICaller.getRooms(
            ((rooms: Array<APITypes.Room>) => {
                this.props.setRooms(rooms);
                this.fetchRoomsConfigs();
            }).bind(this),
            ((err: APITypes.ErrorType) => {
                console.log("ERROR ", err);
            }).bind(this)
        );
    }

    componentWillReceiveProps(newProps: PropsType) {
        var roomsIds = Object.keys(newProps.rooms);
        for (var i = 0; i < roomsIds.length; i++) {
            var room = newProps.rooms[roomsIds[i]];
            var roomId = room.identifier;
            RoomConfigManager.addRoom(roomId);
        }
    }

    componentWillMount() {
        RoomConfigManager.initialize(WebSocketCommunication);

        /* bind websocket callbacks */
        WebSocketCommunication.setOnConnected(this.onConnected.bind(this));
        WebSocketCommunication.setOnMessage(this.onMessage.bind(this));

        /* Request websocket token */
        DashboardAPICaller.requestToken(((token: APITypes.CreatedToken) => {
            WebSocketCommunication.setOnDisconnected(this.onDisconnected.bind(this));
            WebSocketCommunication.connect(this.createWebsocketURL(token.id));
            this.fetchRooms(token.id);
        }).bind(this), ((error: APITypes.ErrorType) => {
            console.error(error);
        }).bind(this), {
            'requested_token_type': 'hotel_user'
        });

        this.componentWillReceiveProps(this.props);
    }

    componentWillUnmount() {
    }

    /* websocket callback on connect event */
    onConnected() : any {
        const { setConnectionState, rooms } = this.props;
        setConnectionState(2);
    }

    /* websocket callback on disconnect event */
    onDisconnected() : any {
        const { setConnectionState, setConfig } = this.props;
        setConnectionState(0);
        setConfig("1", null);
    }

    /* websocket callback on message event */
    onMessage(data: ConnectionTypes.WebSocketDataType) : any {
        const { setConfig, setThingsStates } = this.props;

        /* set config if provided */
        if ('config' in data) {
            console.log("got config: ", data.config);
            setConfig("1", data.config);
            delete data['config'];
        }

        /* set things states if provided */
        if (Object.keys(data).length > 0) {
            setThingsStates("1", data);
        }
    }

    render() {
        const { rooms, selectedRoomId } = this.props;

        return (
            <div style={styles.mainContainer}>
                <div style={styles.fakeTopBar}>
                </div>
                <div style={styles.ContentContainer}>
                    <div style={styles.ordersContainer}>
                        <OrdersContent />
                    </div>
                    <div style={styles.roomsContainer}>
                        <RoomsContent rooms={rooms} />
                    </div>
                </div>
            </div>
        );
    }
};
DashboardBase.contextTypes = {
    store: PropTypes.object
};

const styles = {
    mainContainer: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },
    fakeTopBar: {
        height: 60,
        backgroundColor: 'rgb(46, 46, 46)',
    },
    ContentContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
    },
    ordersContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'scroll',
        backgroundColor: 'rgb(86, 86, 86)',
    },
    roomsContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'scroll',
        overflowX: 'hidden',
        backgroundColor: 'rgb(126, 126, 126)',
    },
}

export const Dashboard = AppWrapper(ReduxConnect(mapStateToProps, mapDispatchToProps) (DashboardBase));
