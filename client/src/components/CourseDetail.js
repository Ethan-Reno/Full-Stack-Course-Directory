import React, {Component} from  'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

export default class CourseDetail extends Component {

  state = {
    course: [],
    user: [],
    errors: []
  }

  // on load / reload, call API to GET the specific course that matches the id parameter in the URL
  componentDidMount() {
    axios.get(`http://localhost:5000/api/${this.props.match.url}`)
      .then(data => {
        this.setState({courses: data.data, user: data.data.User});
        console.log(this.props.match)
      })
      .catch(err => {
        console.log(err)
        // if there is no match, route to notfound
        this.props.history.push('/notfound')
      })
  }

  handleDelete = () => {
    const {context} = this.props;
    const authenticatedUser = context.authenticatedUser;
    const userEmail = authenticatedUser.emailAddress;
    const userPassword = authenticatedUser.password;
    const {title} = this.state;
    const id = this.props.match.params.id

    context.data.deleteCourse(id, userEmail, userPassword)
      .then(errors => {
        if (errors) {
          this.setState({errors})
            return {errors: [`The ${title} course could not be deleted`]}
        } else {
          this.props.history.push('/');
        }
      })
      .catch(err => {
        this.props.history.push('/error')
      })
  }

  render(){

    return(
      <div>
        <div className="actions--bar">

        </div>
      </div>
    )
  }

}