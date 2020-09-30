import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';//when importing, must export at
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types'
import { register } from '../../actions/auth';


//import axios from 'axios';
//can use props because of export default connect(null, { setAlert }
//const Register = (props) => { destructured props to use setAlert instead of prop.setAlert
const Register = ({setAlert, register, isAuthenticated}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;
  //[e.target.name] refers to tag 'name' which is name, email, password, and password 2 below
  //if we used name:e.target.value it would only change name='name'
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  //uses sync await so use async
  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
      //this passes in as a message to actions (actions/alert.js), which
      //generates a uuid and dispatches an alert with that message
      
      //console.log('Passwords do not match');
    } else {
      //from actions/auth.js
      console.log(name, email, password);
      register({name, email, password});
      //////////////below happens in redux action, so no need to happen in component
      //example of how it works in request
      // //have access to form data
      // const newUser = {
      //     //same as name: name, email: email, password: password
      //     name,
      //     email,
      //     password
      // }
      // try {
      //     const config = {
      //         headers: {
      //             //need to now recreate config
      //             'Content-Type': 'Application/json'

      //         }
      //     }
      //     const body = JSON.stringify(newUser);

      //     //axios returns a promise, and are making a post req
      //     const res = await axios.post('/api/users', body, config);

      //     console.log(res.data);//should be the token
      // } catch (err) {
      //     console.error(err.response.data)
      // }
    }
  }
    
  if (isAuthenticated) {
    return <Redirect to="/dashboard"/>
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user" /> Create Your Account
      </p>
      <form className="form" onSubmit={e=>onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e=>onChange(e)}
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            minLength='6'
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={e=>onChange(e)}
            minLength='6'
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};


Register.prototypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

//put connect() and put Register in parenthesis
//null, { setAlert } allows to use props.setAlert
export default connect(mapStateToProps, { setAlert, register })(Register);