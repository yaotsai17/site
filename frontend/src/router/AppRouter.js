/*
Core Libs
*/
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import React from 'react';

/*
Custom Helpers
*/
import PrivateRoute from './PrivateRoute';
import DefaultRoute from './DefaultRoute';

/*
Other Major Components
*/
import Login from '../components/login/Login.component';
import Dashboard from '../components/dashboard/Dashboard.component';
import Marketplace from '../components/marketplace/Marketplace.component';
import CreateListing from '../components/create-listing/CreateListing.component';
import Profile from '../components/profile/Profile.component';
import DetailedListingPage from '../components/marketplace/MarketplaceListings/DetailedListingPage/DetailedListingPage.component';

import AuthCallback from '../components/auth-callback/AuthCallback';
import Auth from '../components/auth/Auth';

import store from '../store/index';



/* Initialization of Auth, 
 *    passing in redux store to dispatch profile on successful login.
 */
const auth = new Auth(store);

const handleAuthentication = (nextState, replace, history) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication(history);
  }
}

/**
 * Main router for the app.
 * Integeration tested:
 *    - Each path display its own component.
 *    - Private Routes can only be accessed after authentication pass.
 *    - Default Routes display expected components base on authentication status.
 */
const AppRouter = () => (

  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Switch>
      <Route exact path='/' render={(props) => <Login auth={auth} {...props} />} />
      <PrivateRoute exact path='/dashboard' component={Dashboard} auth={auth} />
      <PrivateRoute exact path='/dashboard/:type' component={Dashboard} auth={auth} />
      <PrivateRoute exact path='/marketplace' component={Marketplace} auth={auth} />
      <PrivateRoute exact path='/create' component={CreateListing} auth={auth} />
      <PrivateRoute path='/listing/:id' component={DetailedListingPage} auth={auth} />
      <PrivateRoute exact path='/profile' component={Profile} auth={auth} />
      <PrivateRoute path='/q/:userId' component={Profile} auth={auth} />
      <Route path='/auth-callback' render={(props) => {
        handleAuthentication(props, null, props.history);
        return <AuthCallback auth={auth} {...props} />
      }} />
      <DefaultRoute auth={auth} />
    </Switch>
  </BrowserRouter>
);


export default AppRouter;