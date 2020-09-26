import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//need to imbed this into app.js

//destructured props again/// props = ({alerts})
//check if array is null or if 0
//using only 1 expression
const Alert = ({ alerts }) =>
    alerts !== null && alerts.length > 0 && alerts.map(alert => (
        //whenever maping through an array and output jsx you need a key
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            { alert.msg }
        </div>
    ));

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
}
//grabbing state from index.js
const mapStateToProps = state => ({
   alerts: state.alert 
});

export default connect(mapStateToProps)(Alert);