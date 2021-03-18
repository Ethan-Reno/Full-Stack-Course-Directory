import React, {Component} from  'react';
import Form from './Form';

export default class CreateCourse extends Component {
  state = {
    title: '',
    description: '',
    esteimatedTime: '',
    errors: []
  }

  render() {
    const {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      errors
    } = this.state;
  
    const {context} = this.props;
    const authenticatedUser = context.authenticatedUser;

    return (
      <div className="bounds course--detail">
        <h1>Create Course</h1>
        <Form
          cancel={this.cancel}
          errors={errors}
          submit={this.submit}
          submitButtonText="Create Course"
          elements={() => (
            <React.Fragment>
              <div className="grid-66 grid-left">
                <div className="course--stats">
                  <ul className="course--add--list">
                    <li className="course--add--list--item">
                      <h4>Course Title</h4>
                      <div>
                        <input 
                        id="title" 
                        name="title" 
                        type="text" 
                        value={title} 
                        onChange={this.change} />
                      </div>
                    </li>
                    <li className="course--add--list--item">
                      <h4>Course Author</h4>
                      <input readOnly value={`${authenticatedUser.firstName} ${authenticatedUser.lastName}`} />
                    </li>
                    <li className="course--description">
                      <h4>Course Description</h4>
                      <div>
                        <textarea 
                        id="description" 
                        name="description" 
                        value={description} 
                        onChange={this.change}>
                        </textarea>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid-33 grid-right">
                <div className="course--stats">
                  <ul className="course--add--list">
                    <li className="course--add--list--item">
                      <h4>Estimated Time</h4>
                      <div>
                        <input 
                        id="estimatedTime" 
                        name="estimatedTime" 
                        type="text" 
                        value={estimatedTime} 
                        onChange={this.change} />
                      </div>
                    </li>
                    <li className="course--description">
                      <h4>Materials Needed</h4>
                      <div>
                        <textarea 
                        id="materialsNeeded" 
                        name="materialsNeeded" 
                        type="text" 
                        className=""
                        value={materialsNeeded} 
                        onChange={this.change}>
                        </textarea>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </React.Fragment>
          )}
        />
      </div>
    )
  }

  // Handles submitting the form
    submit = () => {
      const {context} = this.props;
      const authenticatedUser = context.authenticatedUser;
      const userEmail = authenticatedUser.emailAddress;
      const userPassword = authenticatedUser.password;
      const userId = authenticatedUser.id;
      const {title, description, estimatedTime, materialsNeeded} = this.state;
      const course = {title, description, estimatedTime, materialsNeeded, userId}
  
      context.data.createCourse(course, userEmail, userPassword)
        .then(errors => {
          if (errors.length) {
            this.setState({errors})
              return {
                errors: ['Failed to create course']
              }
          } else {
            this.props.history.push('/');
          }
        })
        .catch(err => {
          this.props.history.push('/error')
        })
  }

  // Handles changes in form fields, according to its matching name in state and the form
  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      }
    })
  }

  // Handles cancelling course creation
  cancel = () => {
    this.props.history.push('/')
  }

}