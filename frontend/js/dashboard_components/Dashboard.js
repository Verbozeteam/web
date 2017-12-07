/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { connect as ReduxConnect } from 'react-redux';
import { STORE, AppWrapper } from "../redux/store";
import * as connectionActions from '../redux/actions/connection';

import * as APITypes from '../api-utils/APITypes';
import * as ConnectionTypes from '../api-utils/ConnectionTypes';
import { APICaller } from '../api-utils/API';
import { WebSocketCommunication } from '../api-utils/WebSocketCommunication';

import { RoomCard } from './RoomCard';
import { RoomFullView } from './RoomFullView';

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
    };
}

type PropsType = {
	...any,
};

type StateType = {
	...any,
};

class DashboardBase extends React.Component<PropsType, StateType> {
	_columns_per_row: number = 4;
	_ws_url: string = 'ws://www.verboze.com/stream/';
	_ws_token: string = '9d1a4c0f23b344b79e98e377add50821'; /** @TODO: FETCH FROM VERBOZE! */

    componentWillMount() {
	    /* bind websocket callbacks */
	    WebSocketCommunication.setOnConnected(this.onConnected.bind(this));
	    WebSocketCommunication.setOnDisconnected(this.onDisconnected.bind(this));
	    WebSocketCommunication.setOnMessage(this.onMessage.bind(this));

        /** Fetch the rooms */
		APICaller.getRooms(
			((rooms: Array<APITypes.Room>) => {
	            this.props.setRooms(rooms.concat(rooms).concat(rooms).concat(rooms).concat(rooms).concat(rooms).concat(rooms).concat(rooms).concat(rooms));
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
			code: 0
		});
	}

	/* websocket callback on disconnect event */
	onDisconnected() : any {
		const { setConnectionState, setConfig } = this.props;
		setConnectionState(0);
		setConfig(null);
	}

	/* websocket callback on message event */
	onMessage(data: ConnectionTypes.WebSocketDataType) : any {
		const { setConfig, setThingsStates } = this.props;

		/* set config if provided */
		if ('config' in data) {
			console.log("got config: ", data.config);
			setConfig(data.config);
			delete data['config'];
		}

		/* set things states if provided */
		if (Object.keys(data).length > 0) {
			setThingsStates(data);
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
				<RoomFullView
					room={selectedRoom}/>
			);
		} else {
			var rows = [];
			var room_views = [];
			for (var i = 0; i < rooms.length; i++) {
				room_views.push(
					<RoomCard
						key={'room-view-'+i}
						room={rooms[i]}
						/>
				);

				if (room_views.length == this._columns_per_row || i == rooms.length - 1) {
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
	    maxHeight: 250,
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
	},
}

export const Dashboard = AppWrapper(ReduxConnect(mapStateToProps, mapDispatchToProps) (DashboardBase));
