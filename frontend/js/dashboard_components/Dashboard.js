/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import * as styles from '../../css/dashboard/main.css';

import { connect } from 'react-redux';
import { STORE, AppWrapper } from "../redux/store";
import * as connectionActions from '../redux/actions/connection';

import * as APITypes from '../api-utils/APITypes';
import { APICaller } from '../api-utils/API';

import { Shitponent } from './Shitponent';

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



		return (
			<div className={styles.best_class}>
				<h3>DASHBOARD - Hello World!</h3>
				<Shitponent />
			</div>
		);
	}
};
DashboardBase.contextTypes = {
    store: PropTypes.object
};

export const Dashboard = AppWrapper(connect(mapStateToProps, mapDispatchToProps) (DashboardBase));
