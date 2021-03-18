import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

export default class UserSignIn extends Component {
  state = {
    emailAddress: '',
    password: '',
    errors: [],
  }

  render() {
    const {
      emailAddress,
      password,
      errors,
    } = this.state;

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign In"
            elements={() => (
              <React.Fragment>
                <input 
                  id="emailAddress" 
                  name="emailAddress" 
                  type="text"
                  value={emailAddress} 
                  onChange={this.change} 
                  placeholder="Email Address" />
                <input 
                  id="password" 
                  name="password"
                  type="password"
                  value={password} 
                  onChange={this.change} 
                  placeholder="Password" />                
              </React.Fragment>
            )} />
          <p>
            Don't have a user account? <Link to="/signup">Click here</Link> to sign up!
          </p> 
        </div>
      </div>
    );
  }

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  submit = () => {
    // extract the context prop from this.props
    const { context } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    
    // unpack properties from the state object – these are the properties needed to sign in a user
    const { emailAddress, password } = this.state;

    // call the getUser API method (in Data.js) and returns a promise
    context.actions.signIn(emailAddress, password) // made available via the provider value prop
      .then(user => { //fullfilment value as a parameter named user
        if (user === null) {
          this.setState(() => {
            return {errors: ['Sign-in was unsuccessful']};
          });
        } else {
          // push a new entry onto the history stack using the push() method
          this.props.history.push(from);
        }
      })
      .catch(err => {
        this.setState(() => {
        return { errors: ['Sign-in was unsuccessful'] }
        })
      })
  }

  cancel = () => {
    this.props.history.push('/');
  }
}
