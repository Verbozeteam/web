// @flow

import * as React from 'react';
import * as ReactDom from 'react-dom';

// import '../semantic/dist/semantic.min.css';

import HomepageLayout from "./public-website-components/HomepageLayout";

let react_app_element = document.getElementById('react-app');

if (react_app_element instanceof HTMLElement) {
	ReactDom.render(<HomepageLayout/>, react_app_element);
}
