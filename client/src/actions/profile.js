import axios from 'axios';
import { setAlert } from './alert';

import {
    GET_PROFILE,
    GET_PROFILES,
    UPDATE_PROFILE,
    PROFILE_ERROR,
    ACCOUNT_DELETED,
    CLEAR_PROFILE,
    GET_REPOS,
    NO_REPOS
} from './types';

//get current user profile, want to get api/profile/me from backend
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');
        //console.log('getcurrentprofile')
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
}

//get all profiles
export const getProfiles = () => async dispatch => {
    dispatch({ type: CLEAR_PROFILE });//stops flashing of past profiles
    try {
        const res = await axios.get('/api/profile');
        //console.log('getcurrentprofile')
        dispatch({
            type: GET_PROFILES,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
}


//get profile by id
export const getProfileById = userId => async dispatch => {
    
    try {
        const res = await axios.get(`/api/profile/user/${userId}`);
        //console.log('getcurrentprofile')
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
}

//get github repo
export const getGithubRepos = username => async dispatch => {
    try {
        console.log('getgithubrepoaction')
        const res = await axios.get(`/api/profile/github/${username}`);
        
        dispatch({
            type: GET_REPOS,
            payload: res.data
        });
    } catch (error) {
        console.log(error)
        dispatch({
            type: NO_REPOS
        });
    }
}

//create/update profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        //when sending data, use config
        //use content type b/c sending data
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('/api/profile', formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

        if (!edit) {
            history.push('/dashboard');
         }

    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach(error=>dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
        
    }
}

//add experience, takes in history b/c want to redirect to dashboard after
export const addExperience = (formData, history) => async dispatch => {
    try {
        //when sending data, use config
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/experience', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Experience Added', 'success'));
        history.push('/dashboard');
         

    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach(error=>dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
        
    }


}


//add education
export const addEducation = (formData, history) => async dispatch => {
    try {
        //when sending data, use config
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.put('/api/profile/education', formData, config);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert('Education Added', 'success'));
        history.push('/dashboard');
         

    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach(error=>dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
        
    }


}

//delete experience
export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Experience Removed', 'success'));

    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
        
    }
}

//delete experience
export const deleteEducation = id => async dispatch => {
    console.log('deleted exp')
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Education Removed', 'success'));

    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
        
    }
}

//delete account and profile
//delete 
export const deleteAccount = () => async dispatch => {
    if(window.confirm('Are you sure? This can NOT be undone!')) {
        try {
    
            dispatch({
                type: CLEAR_PROFILE
            })
            dispatch({
                type: ACCOUNT_DELETED
            })
    
            dispatch(setAlert('Your account hhas been permanantly deleted'));
    
        } catch (error) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            });
            
        }
    }

}