import React, {Component} from  'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

export default class Courses extends Component {
  state = {
    courses: []
  }

  // on load / reload, call API to GET all courses
  componentDidMount() {
    axios.get('http://localhost:5000/api/courses')
      .then(data => {
        this.setState({courses: data.data, user: data.data.User})
      })
      .catch(err => {
        this.props.history.push('/error')
      })
  }

  // on update, call API to GET all courses
  componentDidUpdate(updateProps) {
    if (updateProps.location.pathame !== this.props.location.pathname){
      axios.get('http://localhost:5000/api/courses')
        .then(data => {
          this.setState({courses: data.data, user: data.data.User});
        })
      .catch(err => {
        console.log(err)
      })
    }
  }

  render(){
    const apiCall = this.state.courses;
    let courseList = apiCall.map(course =>
      <React.Fragment key={course.id}>
        <div className="grid-33">
          <Link className="course--module course--link" to={`/courses/${course.id}`}>
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{course.title}</h3>
          </Link>
        </div>
      </React.Fragment>
    )

    return (
      <div className="bounds"> {courseList}
        <div className="grid-33"> 
          <Link className="course--module course--add--module" to="/courses/create">
            <h3 className="course--add--title">New Course</h3>
          </Link>
        </div>
      </div>      
    )
  }
}