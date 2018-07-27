import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './views/components/Home/LandingPage';

const Routes = () => (
  <div>
    <Switch>
      <Route exact path="/" component={ LandingPage } />
    </Switch>
  </div>);

export default Routes;
