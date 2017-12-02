// @flow

import * as React from 'react';

import * as styles from '../../css/dashboard/main.css';

type PropsType = {};

type StateType = {};

export class DashboardApp extends React.Component<PropsType, StateType> {

	render() {
		return (
			<div className={styles.best_class}>
				<h3>DASHBOARD - Hello World!</h3>
			</div>
		)

	}
}