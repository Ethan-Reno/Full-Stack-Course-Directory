import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from './Context';

// PrivateRoute component will serve as a high-order component for any routes that you want to protect and make accessible to authenticated users only.
// It will render the private component passed to its component prop when the URL matches the specified path

export default ({ component: Component, ...rest }) => {  // "... rest" collects any props that get passed to it
  return (
    <Consumer>
      { context => (
        <Route
          {...rest}
          render={props => context.authenticatedUser ? (
              <Component {...props} />
            ) : (
              <Redirect to={{
                pathname: '/signin',
                state: {from: props.location}, //state property whose value is the current location of the route the user tried to access
              }} />
            )
          }
        />
      )}
    </Consumer>
  );
};