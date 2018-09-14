/* @flow */

import * as React from 'react';
import ReactNative from 'react-native-web';
import { BrowserRouter, Switch, Route} from 'react-router-dom';

import ScrollToTop from './public-website-components/react-router-extra/ScrollToTop';

import { App } from './public-website-components/App';
import { TechCrunchBattlefield } from './public-website-components/TechCrunchBattlefield';

let react_app_element = document.getElementById('react-app');

if (react_app_element instanceof HTMLElement) {
	ReactNative.render((
		<BrowserRouter>
			<ScrollToTop>
        <Switch>
          <Route path='/techcrunch' component={TechCrunchBattlefield}/>
  				<Route path='/' component={App}/>
        </Switch>
			</ScrollToTop>
		</BrowserRouter>
	), react_app_element);
}
