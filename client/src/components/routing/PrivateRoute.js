import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';


/*
if the user is not logged in and they should not be on a certain page without being logged in, 
you can use privateroute to redirect users to the login page
*/

const PrivateRoute =
    ({ component: Component,
        auth: { isAuthenticated, loading },
        ...rest
    }) => {
    return (
        <Route
            {...rest} render = {props => !isAuthenticated && !loading ?
            (<Redirect to='/login' />) : (<Component {...props} />)}
        />
    )
}

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired,
}
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps)(PrivateRoute)
