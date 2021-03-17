import React from 'react';

export default ({context}) => {
  const authUser = context.authenticatedUser;

  return (
  <div className="bounds">
    <div className="grid-100">
      <h1>You are authenticated!</h1>
      <p>Your name is {authUser.firstName} {authUser.lastName}.</p>
      <p>Your email address is {authUser.emailAddress}.</p>
    </div>
  </div>
  );
}