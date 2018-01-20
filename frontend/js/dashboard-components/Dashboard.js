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

import { RoomCard } from './RoomCard';
import { RoomWindow } from './RoomWindow';

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
	_ws_url: string = 'ws://localhost:8000/stream/';
	_ws_token: string = '345413a3c8ae4647ae0d7c8ac264ac49'; /** @TODO: FETCH FROM VERBOZE! */

    componentWillMount() {
	    /* bind websocket callbacks */
	    WebSocketCommunication.setOnConnected(this.onConnected.bind(this));
	    WebSocketCommunication.setOnDisconnected(this.onDisconnected.bind(this));
	    WebSocketCommunication.setOnMessage(this.onMessage.bind(this));

        /** Fetch the rooms */
		DashboardAPICaller.getRooms(
			((rooms: Array<APITypes.Room>) => {
	            this.props.setRooms(rooms);
			}).bind(this),
			((err: APITypes.ErrorType) => {
				console.log("ERROR ", err);
			}).bind(this)
		);

		this.connect();
    }

    componentWillUnmount() {
    }

	/* websocket connect */
	connect() : any {
		const { setConnectionState } = this.props;

		WebSocketCommunication.connect(this._ws_url + this._ws_token + '/');
		setConnectionState(1);
	}

	/* websocket callback on connect event */
	onConnected() : any {
		const { setConnectionState } = this.props;
		setConnectionState(2);

		WebSocketCommunication.sendMessage({
			code: 0,
			__room_id: "1",
		});
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

		var content = null;
		if (selectedRoomId && selectedRoomId != "") {
			var selectedRoom = null;
			for (var i = 0; i < rooms.length; i++)
				if (rooms[i].id == selectedRoomId)
					selectedRoom = rooms[i];
			content = (
				<RoomWindow
					room={selectedRoom}/>
			);
		} else {
			var columns_per_row = 4;
			var rows = [];
			var room_views = [];
			for (var i = 0; i < rooms.length; i++) {
				room_views.push(
					<RoomCard
						key={'room-view-'+i}
						room={rooms[i]}
						/>
				);

				if (room_views.length == columns_per_row || i == rooms.length - 1) {
					rows.push(
						<div
							key={'rooms-row-'+rows.length}
							style={styles.roomsRow}>
							{room_views}
						</div>
					);
					room_views = [];
				}
			}
			content = rows;
		}

		return (
			<div style={styles.mainContainer}>
				<div style={styles.fakeTopBar}>
				</div>
				<div style={styles.fakeSidebarAndContentContainer}>
					<div style={styles.fakeSidebar}>
					</div>
					<div style={styles.fakeContentContainer}>
						{content}
					</div>
				</div>
				<div style={styles.fakeBottomBar}>
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
	roomsRow: {
	    display: 'flex',
	    flex: 1,
	    flexDirection: 'row',
	    maxHeight: 260,
	    minHeight: 230,
	},
	fakeTopBar: {
	    height: 60,
	    backgroundColor: 'rgba(150, 150, 150, 255)',
	},
	fakeSidebarAndContentContainer: {
	    flex: 1,

	    display: 'flex',
	    flexDirection: 'row',
	},
	fakeSidebar: {
	    width: 300,
	    backgroundColor: 'rgba(240, 240, 240, 255)',
	},
	fakeContentContainer: {
	    flex: 1,
	    display: 'flex',
	    flexDirection: 'column',
	    overflowY: 'scroll',
	    overflowX: 'hidden',
	},
	fakeBottomBar: {
	    height: 20,
	}
}

export const Dashboard = AppWrapper(ReduxConnect(mapStateToProps, mapDispatchToProps) (DashboardBase));
