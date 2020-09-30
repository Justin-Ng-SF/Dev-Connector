import axios from 'axios';
//using axios to add global header

const setAuthToken = token => {
    if (token) { //check local storage for token to set headers as token
        axios.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export default setAuthToken;