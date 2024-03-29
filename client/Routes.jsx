import React from 'react';
import { Route, IndexRoute } from 'react-router';
import connectedApp from './components/App';
import LandingPage from './components/landing/LandingPage';
import SignupPage from './components/signup/SignupPage';
import UserDocuments from './components/home/UserDocuments';
import ExplorePage from './components/explore/ExplorePage';
import DashboardPage from './components/dashboard/DashboardPage';
import requiresAuthentication from './utilities/RequiresAuthentication';
import alreadyAuthenticated from './utilities/AlreadyAuthenticated';

export default (
  <Route path="/" component={connectedApp}>
    <IndexRoute component={alreadyAuthenticated(LandingPage)} />
    <Route path="signup" component={alreadyAuthenticated(SignupPage)} />
    <Route path="documents" component={requiresAuthentication(UserDocuments)} />
    <Route path="explore" component={requiresAuthentication(ExplorePage)} />
    <Route
      path="dashboard"
      component={requiresAuthentication(DashboardPage)}
    />
  </Route>
);
