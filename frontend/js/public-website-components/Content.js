/* @flow */

import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Features from './Features'
import AboutUs from './AboutUs'


const Content = () => (
    <Switch>
      <Route path='/features' component={Features}/>
      <Route path='/about-us' component={AboutUs}/>
      <Route exact path='/' component={Home}/>
    </Switch>
)

export default Content
