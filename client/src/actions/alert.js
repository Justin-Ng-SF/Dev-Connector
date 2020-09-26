//import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';
import { v4 as uuidv4 } from 'uuid';


/*
can do b'c of func middleware
set alert is an action that dispatches the type of SET_ALERT to the reducer(reducer/alert.js)
and adds the alert to the state which is initially an empty array as seen on line 2 of reducer/alert.js
*/
export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    //const id = uuid.v4(); // gives random long string
    const id = uuidv4(); // gives random long string
    //want to call set_alert from /reducer
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });

    //after certain amt of time, remove alert(setTimeout is a js func taking in a func for first param, time(ms) to wait out for 2nd param)
    setTimeout(()=> dispatch({ type: REMOVE_ALERT, payload: id }), timeout)

}