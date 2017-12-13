/* @flow */

import * as React from 'react';
import * as ReactDom from 'react-dom';

import {
  BrowserRouter,
} from 'react-router-dom';

import ScrollToTop from './public-website-components/react-router-extra/ScrollToTop';

import { App } from './public-website-components/App';

let react_app_element = document.getElementById('react-app');

if (react_app_element instanceof HTMLElement) {
	ReactDom.render((
		<BrowserRouter>
			<ScrollToTop>
				<App/>
			</ScrollToTop>
		</BrowserRouter>
	), react_app_element);
}
