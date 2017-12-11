/* @flow */

import * as React from 'react';
import * as ReactDom from 'react-dom';

import {
  BrowserRouter,
} from 'react-router-dom';

// import '../semantic/dist/semantic.min.css';

import App from './public-website-components/App';


let react_app_element = document.getElementById('react-app');

if (react_app_element instanceof HTMLElement) {
	ReactDom.render((
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	), react_app_element);
}
