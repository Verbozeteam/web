/* @flow */

import * as React from 'react';
import ReactDOM from 'react-dom';

import App from './deployment-manager-components/App';

let react_app_element = document.getElementById('react-app')

if (react_app_element instanceof HTMLElement) {
  ReactDOM.render(
    <App />,
    react_app_element
  );
}
