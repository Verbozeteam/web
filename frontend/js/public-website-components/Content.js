/* @flow */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';

import Company from './Company';
import Contact from './Contact';

// Features
import ModernizingControl from './features/ModernizingControl';
import EmpoweringGuests from './features/EmpoweringGuests';
import ReImaginingHotels from './features/ReImaginingHotels';
import AdoptingVerboze from './features/AdoptingVerboze';


const Content = () => (
    <Switch>
      <Route path='/company' component={Company}/>
      <Route path='/contact' component={Contact}/>
      <Route path='/modernizing-control' component={ModernizingControl}/>
      <Route path='/empowering-guests' component={EmpoweringGuests}/>
      <Route path='/reimagining-hotels' component={ReImaginingHotels}/>
      <Route path='/adopting-verboze' component={AdoptingVerboze}/>
      <Route exact path='/' component={Home}/>
    </Switch>
)

export default Content
