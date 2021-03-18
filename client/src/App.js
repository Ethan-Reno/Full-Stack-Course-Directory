import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/Header';
import Courses from './components/Courses';
import CourseDetail from './components/CourseDetail';
import NotFound from './components/NotFound';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import Authenticated from './components/Authenticated';
import withContext from './Context';
import PrivateRoute from './PrivateRoute';

const HeaderWithContext = withContext(Header);
const AuthWithContext = withContext(Authenticated);
const CourseDetailWithContext = withContext(CourseDetail);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
// This connects the component to context. 
// Each is now a consuming component subscribed to all context changes.
// When React renders a component that subscribes to context, it will read the context value passed to it from its Provider.

export default () => (
  <Router>
    <div>
      <HeaderWithContext />

      <Switch>
        <Route exact path="/" component={Courses} />
        <PrivateRoute path="/authenticated" component={AuthWithContext} />
        <PrivateRoute path="/settings" component={AuthWithContext} />
        <Route path="/courses/:id" component={CourseDetailWithContext} />
        <Route path="/signin" component={UserSignInWithContext} />
        <Route path="/signup" component={UserSignUpWithContext} />
        <Route path="/signout" component={UserSignOutWithContext} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
);