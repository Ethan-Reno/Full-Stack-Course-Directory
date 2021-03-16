import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

export default class UserSignUp extends Component {
  state = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    errors: [],
  }

  render() {
    const {
      firstName,
      lastName,
      emailAddress,
      password,
      errors,
    } = this.state;

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <Form 
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Sign Up"
            elements={() => ( //render prop
            // a function which returns the input fields to be used in each of the forms:
              <React.Fragment>
                <input 
                  id="firstName" 
                  name="firstName" 
                  type="text"
                  value={firstName} 
                  onChange={this.change} 
                  placeholder="First Name" />
                <input 
                  id="lastName" 
                  name="lastName" 
                  type="text"
                  value={lastName} 
                  onChange={this.change} 
                  placeholder="Last Name" />
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
            Already have a user account? <Link to="/signin">Click here</Link> to sign in!
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
    const {context} = this.props;

    // unpack the properties from the state object (this.state) into distinct variables:
    const {
      firstName,
      lastName,
      emailAddress,
      password,
    } = this.state;

    // New user payload that will be passed to the createUser() method
    const user = {
      firstName,
      lastName,
      emailAddress,
      password,
    };

    // Create a user, sign them in, and redirect them to the /authenticated route
    context.data.createUser(user) // made available via Context from data.js
    .then( errors => {
        if(errors.length) {
          this.setState({errors});
        } else {
          context.actions.signIn(emailAddress, password)
            .then(() => {
              this.props.history.push('/authenticated');    
            });
        }
    })
    .catch( err => {
      console.log(err);
      // push a new entry onto the history stack using the push() method
      this.props.history.push('/error');
    });
  }

  cancel = () => {
    this.props.history.push('/'); // push the root path ('/') onto the history stack:
  }
}
