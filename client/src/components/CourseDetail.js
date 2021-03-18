import React, {Component} from  'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

export default class CourseDetail extends Component {

  state = {
    course: [],
    user: [],
    errors: []
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

  // on load / reload, call API to GET the specific course that matches the id parameter in the URL
  componentDidMount() {
    axios.get(`http://localhost:5000/api/${this.props.match.url}`)
      .then(data => {
        this.setState({course: data.data, user: data.data.User});
        //console.log(this.props.match)
      })
      .catch(err => {
        console.log(err)
        // if there is no match, route to notfound
        this.props.history.push('/notfound')
      })
  }

  render(){

    const {context} = this.props;
    const authenticatedUser = context.authenticatedUser;

    const estimatedTimeMarkdown = ` #### Estimated Time \n\n ### ${this.state.course.estimatedTime}`
    const materialsNeededMarkdown = `${this.state.course.materialsNeeded}`

    return(
      <div>
        <div className="actions--bar">
          <div className="bounds">
            {/*If the user is authenticated and the owner of the course, render links to the POST and DELETE routes*/}
            {authenticatedUser && authenticatedUser.id === this.state.course.userId ?
              <React.Fragment>
                <div className ="grid-100">
                  <span>
                    <Link className="button" to={`${this.props.match.url}/update`}>Update Course</Link>
                    <Link className="button" to="/courses" onClick={this.handleDelete}>Delete Course</Link>
                    <Link className="button button-secondary" to="/courses">Go back</Link>
                  </span>
                </div>
              </React.Fragment>
              :
              <React.Fragment>
                <Link className="button button-secondary" to="/courses">Go back</Link>
              </React.Fragment>
            }
          </div>
        </div>
        <div className ="bounds course-detail">
          <div className ="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{this.state.course.title}</h3>
              <p>By {this.state.user.firstName} {this.state.user.lastName}</p>
            </div>
            <div>
              <p>{this.state.course.description}</p>
            </div>
        </div>
        <div className="grid-25 grid-right">
          <div className="course--stats">
            <ul className="course--stats--list">
              <li className="course--stats--list--item">
                  <ReactMarkdown source={estimatedTimeMarkdown}/>
              </li> 
              <li className="course--stats--list--item">
                <h4>Materials Needed</h4>
                  <ReactMarkdown source={materialsNeededMarkdown}/>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    )
  }
}