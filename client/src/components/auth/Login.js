import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

const Login = ({login, isAuthenticated}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;
    //[e.target.name] refers to tag 'name' which is name, email, password, and password 2 below
    //if we used name:e.target.value it would only change name='name'
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    //uses sync await so use async
    const onSubmit = async e => {
      e.preventDefault();
      login(email, password);
      console.log('Logging in');
    }
    
  //redirect if logged in
  if (isAuthenticated) {
    console.log('logged in')
    return <Redirect to ="/dashboard"/>
  }
  
    return (
        <Fragment>
            <h1 className="large text-primary">Sign in</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign in to your account</p>
      <form className="form" onSubmit={e=>onSubmit(e)}>
        <div className="form-group">
            <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={e => onChange(e)}
                required />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            minLength="6" />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account yet? <Link to="/register">Sign up</Link>
      </p>
        </Fragment>
    )
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});


export default connect(mapStateToProps, { login })(Login);