/* @flow */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';

import Company from './Company';
import Contact from './Contact';

// Products
import { ProductList } from './products/Products';


const Content = () => (
    <Switch>
      <Route path='/company' component={Company}/>
      <Route path='/contact' component={Contact}/>
      {ProductList.map(product => <Route key={"product-path-"+product.name} path={product.link} component={product.component} />)}
      <Route exact path='/' component={Home}/>
    </Switch>
)

export default Content
