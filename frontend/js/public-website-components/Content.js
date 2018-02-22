/* @flow */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { URLMap, ComponentPaths } from './URLMap';

import Home from './Home';
import Company from './Company';
import Contact from './Contact';

// Features
import ModernizingControl from './features/ModernizingControl';
import EmpoweringGuests from './features/EmpoweringGuests';
import ReImaginingHotels from './features/ReImaginingHotels';
import AdoptingVerboze from './features/AdoptingVerboze';

var keys = Object.keys(URLMap);
var routes = Object.keys(URLMap).map((urlName: string, index: number) => {
  return {
    component: require('./'+ComponentPaths[urlName]).default,
    name: urlName,
    url: URLMap[urlName],
    index: index,
  };
});

const Content = () => (
  <Switch>
    {routes.map(module => <Route key={"route-"+module.url} path={module.url} component={module.component} exact={module.url === '/'} />)}
  </Switch>
);

module.exports = {
  Content,
};

