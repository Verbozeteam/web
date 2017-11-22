// @flow

import * as React from 'react';
import * as ReactDom from 'react-dom';

import { DashboardApp } from "./dashboard_components/dashboard_app";

let react_app_element = document.getElementById('react-app');

if (react_app_element instanceof HTMLElement) {
	ReactDom.render(<DashboardApp/>, react_app_element);
}
