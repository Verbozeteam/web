/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import * as css_styles from '../../css/dashboard/main.css';

import { connect } from 'react-redux';
import { STORE, AppWrapper } from "../redux/store";
import * as connectionActions from '../redux/actions/connection';

import * as APITypes from '../api-utils/APITypes';
import { APICaller } from '../api-utils/API';

import { RoomView } from './RoomView';

function mapStateToProps(state) {
    return {
        rooms: state.connection.rooms,
    };
}

function mapDispatchToProps(dispatch) {
    return {
    	setRooms: (r: Array<APITypes.Room>) => dispatch(connectionActions.setRooms(r)),
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

    componentWillMount() {
        /** Fetch the rooms */
		APICaller.getRooms(
			((rooms: Array<APITypes.Room>) => {
	            this.props.setRooms(rooms);
			}).bind(this),
			((err: APITypes.ErrorType) => {
				console.log("ERROR ", err);
			}).bind(this)
		);
    }

    componentWillUnmount() {
    }

	render() {
		const { rooms } = this.props;

		var rows = [];
		var room_views = [];
		for (var i = 0; i < rooms.length; i++) {
			room_views.push(
				<RoomView
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

		console.log(rows);

		return (
			<div style={styles.mainContainer}>
				<div style={styles.fakeTopBar}>
				</div>
				<div style={styles.fakeSidebarAndContentContainer}>
					<div style={styles.fakeSidebar}>
					</div>
					<div style={styles.fakeContentContainer}>
						{rows}
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

export const Dashboard = AppWrapper(connect(mapStateToProps, mapDispatchToProps) (DashboardBase));
