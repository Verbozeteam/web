// @flow

import * as React from 'react';
import * as ReactDom from 'react-dom';

import { Dashboard } from "./dashboard_components/Dashboard";

let react_app_element = document.getElementById('react-app');

if (react_app_element instanceof HTMLElement) {
	ReactDom.render(<Dashboard/>, react_app_element);
}
