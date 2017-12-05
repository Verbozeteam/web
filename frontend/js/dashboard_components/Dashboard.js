// @flow

import * as React from 'react';
import axios from 'axios';
import * as styles from '../../css/dashboard/main.css';

import { STORE, AppWrapper } from "../redux/store";

type PropsType = {
};

type StateType = {
};

class Dashboard extends React.Component<PropsType, StateType> {

	constructor(props: PropsType){
		super(props);
		this.state = {
			rooms: []
		};
	}

	componentDidMount() {
		axios.get("/api/lists/")
		  .then(res => {
		  	console.log("Got the following response:");
			const todoLists = res.data
			console.log(todoLists);
			// this.setState({
			// 	todoLists: todoLists
			// });
			this.setState(prevState => ({
        		rooms: prevState.rooms + 1,
      		}));
		  });
	}

	render() {
		return (
			<div className={styles.best_class}>
				<h3>DASHBOARD - Hello World!</h3>
			</div>
		);
	}
};

module.exports = {
	Dashboard: AppWrapper(Dashboard)
};