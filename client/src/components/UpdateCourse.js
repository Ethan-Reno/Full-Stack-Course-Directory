import React, { Component } from 'react';
import Form from './Form';

export default class UpdateCourse extends Component {
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    userId: '',
    course: [],
    errors: [],
    user: []
  }

  //when component first mounts(or on reload), makes call to API via context to retrieve the course that matches the ID in the URL
  componentDidMount() {

    const { context } = this.props
    const authenticatedUser = context.authenticatedUser;
    const userEmail = authenticatedUser.emailAddress;
    const userPass = authenticatedUser.password;
    const id = this.props.match.params.id;

    context.data.getCourse(id, userEmail, userPass)
      .then(data => {
          if (authenticatedUser.id !== data.userId){
            this.props.history.push('/forbidden')
          } else {
            this.setState({
              title: data.title,
              description: data.description,
              estimatedTime: data.estimatedTime,
              materialsNeeded: data.materialsNeeded,
              userId: data.userId,
              user: data.User
            });
          }
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/forbidden')
      })
  }

  render() {
    const { errors } = this.state;
    const { context } = this.props;
    const authenticatedUser = context.authenticatedUser;

    return (
      <div className="bounds course--detail">
        <h1>Update Course</h1>
        <Form
          cancel={this.cancel}
          errors={errors}
          submit={this.submit}
          submitButtonText="Update Course"
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
                        value={this.state.title} 
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
                        value={this.state.description} 
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
                        value={this.state.estimatedTime} 
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
                        value={this.state.materialsNeeded} 
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

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(() => {
      return {
        [name]: value,
      }
    })
  }

  submit = () => {
    const { context } = this.props;

    const authUser = context.authenticatedUser;
    const authUserpass = authUser.password;
    const authUseremail = authUser.emailAddress;

    const course = this.state;
    const id = this.props.match.params.id;

    // updateCourse API call when submitting form
    context.data.updateCourse(id, course, authUseremail, authUserpass)
      .then(errors => {
        if (errors) {
          this.setState({errors})
          return { errors: [`Course ${course.title} did not update`] }
        } else {
          this.setState({course})
          this.props.history.push('/');
        }
      })
      .catch(err => {
        console.log(err);
        this.props.history.push('/forbidden')
      })
  }

  cancel = () => {
    //redirects user to previous page
    this.props.history.push(this.props.history.go(-1)); 
  }
}







// import React, {Component} from  'react';
// import Form from './Form';

// export default class UpdateCourse extends Component {
//   state = {
//     title: '',
//     description: '',
//     estimatedTime: '',
//     materialsNeeded: '',
//     userId: '',
//     course: [],
//     errors: [],
//     user: []
//   }

//   componentDidMount() {
//     const {context} = this.props;
//     const authenticatedUser = context.authenticatedUser;
//     const userEmail = authenticatedUser.emailAddress;
//     const userPassword = authenticatedUser.password;
//     const id = this.props.match.params.id;

//     context.data.getCourse(id, userEmail, userPassword)
//       .then(data => {
//         if(authenticatedUser.id !== data.userId) {
//           this.props.history.push('/forbidden')
//         } else {
//           this.setState({
//             title: data.title,
//             description: data.description,
//             estimatedTime: data.estimatedTime,
//             materialsNeeded: data.materialsNeeded,
//             userId: data.userId,
//             user: data.User
//           });
//         }
//       })
//       .catch(err => {
//         this.props.history.push('/forbidden')
//       })
//   }

//   render() {
  
//     const {title, description, estimatedTime,materialsNeeded, errors} = this.state;
//     const {context} = this.props;
//     const authenticatedUser = context.authenticatedUser;

//     return (
//       <div className="bounds course--detail">
//         <h1>Update Course</h1>
//         <Form
//           cancel={this.cancel}
//           errors={errors}
//           submit={this.submit}
//           submitButtonText="Update Course"
//           elements={() => (
//             <React.Fragment>
//               <div className="grid-66 grid-left">
//                 <div className="course--stats">
//                   <ul className="course--add--list">
//                     <li className="course--add--list--item">
//                       <h4>Course Title</h4>
//                       <div>
//                         <input 
//                         id="title" 
//                         name="title" 
//                         type="text" 
//                         value={title} 
//                         onChange={this.change} />
//                       </div>
//                     </li>
//                     <li className="course--add--list--item">
//                       <h4>Course Author</h4>
//                       <input readOnly value={`${authenticatedUser.firstName} ${authenticatedUser.lastName}`} />
//                     </li>
//                     <li className="course--description">
//                       <h4>Course Description</h4>
//                       <div>
//                         <textarea 
//                         id="description" 
//                         name="description" 
//                         value={description} 
//                         onChange={this.change}>
//                         </textarea>
//                       </div>
//                     </li>
//                   </ul>
//                 </div>
//               </div>

//               <div className="grid-33 grid-right">
//                 <div className="course--stats">
//                   <ul className="course--add--list">
//                     <li className="course--add--list--item">
//                       <h4>Estimated Time</h4>
//                       <div>
//                         <input 
//                         id="estimatedTime" 
//                         name="estimatedTime" 
//                         type="text" 
//                         value={estimatedTime} 
//                         onChange={this.change} />
//                       </div>
//                     </li>
//                     <li className="course--description">
//                       <h4>Materials Needed</h4>
//                       <div>
//                         <textarea 
//                         id="materialsNeeded" 
//                         name="materialsNeeded" 
//                         type="text" 
//                         className=""
//                         value={materialsNeeded} 
//                         onChange={this.change}>
//                         </textarea>
//                       </div>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </React.Fragment>
//           )}
//         />
//       </div>
//     )
//   }

//   // Handles changes in form fields, according to its matching name in state and the form
//   change = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;

//     this.setState(() => {
//       return {
//         [name]: value
//       }
//     })
//   }

//   // Handles submitting the form
//   submit = () => {

//     const {context} = this.props;
//     const authenticatedUser = context.authenticatedUser;

//     const {
//       id,
//       title,
//       description,
//       estimatedTime,
//       materialsNeeded
//     } = this.state;

//     const course = {
//       id,
//       title,
//       description,
//       estimatedTime,
//       materialsNeeded,
//       userId: authenticatedUser.id
//     };

//     const userEmail = authenticatedUser.emailAddress;
//     const userPassword = authenticatedUser.password;

//     context.data.updateCourse(id, course, userEmail, userPassword)
//       .then(errors => {
//         if (errors.length) {
//           this.setState({errors})
//         } else {
//           this.props.history.push(`/courses/${this.state.course.id}`);
//         }
//       })
//       .catch(err => {
//         console.log(err);
//         this.props.history.push("/error")
//       })
//   }

//   // Handles cancelling course udpate - back to the previous page
//   cancel = () => {
//     this.props.history.push(`/course/${this.state.course.id}`);
//   }
// }