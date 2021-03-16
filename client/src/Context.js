import React, { Component } from 'react';
import Data from './Data';
import Cookies from 'js-cookie';

const Context = React.createContext(); 

export class Provider extends Component {

  constructor() {
    super();
    this.data = new Data();
  }

  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null
  };
  

  render() {

    // extract authenticatedUser from this.state
    const { authenticatedUser } = this.state;

    // create a value object to provide the utility methods of the class Data
    const value = {
      authenticatedUser,
      data: this.data, //the value variable is an object with a property "data" with a value of an instance of the data class
      actions: { 
        signIn: this.signIn,
        signOut: this.signOut
      }
    };

    // The Provider lives at the top level of the app, and will allow its child components to gain access to context.
    // Pass context to the provider:
    return (
      // value represents an object containing the context to be shared throughout the component tree.
      <Context.Provider value={value}> 
        {this.props.children}
      </Context.Provider>  
    );
  }

  // uses credentials to call the getUser() method in Data.js
  // which makes a GET request to the protected /users route on the server and returns the user data.
  signIn = async (emailAddress, password) => {
    const user = await this.data.getUser(emailAddress, password);
    // user.password = password;
    if (user !== null) {
      this.setState(() => {
        return {
          authenticatedUser: user,
        };
      });
      // Set cookie
      // First arg gives name of cookie, second gives value, third is options object
      Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 }); // 1 day
    }
    return user;
    // e.g. returned promise value: {name: "Guil", username: "guil@guil.com"}
  }

  signOut = () => {
    this.setState(() => {
      return {
        authenticatedUser: null,
      };
    });
    Cookies.remove('authenticatedUser');
  }


}

export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}