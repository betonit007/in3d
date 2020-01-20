import axios from 'axios';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';
import { REGISTER_SUCCESS, REGISTER_FAIL, AUTH_ERROR, USER_LOADED, LOGIN_SUCCESS, LOGIN_FAIL, LOG_OUT, CLEAR_PROFILE } from '../actions/types';


//Load User
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    

    try {

        const res = await axios.get('api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
        
    } catch (error) {
        console.error(error);
        dispatch({
            type: AUTH_ERROR
        })
    }
}

//Login User
export const login = ( loginInfo ) => async dispatch => {

    dispatch({ type: CLEAR_PROFILE })

    try {
  
      const res = await axios.post('/api/auth', loginInfo);
      dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
      })
        
    } catch (error) {
      
        const errors = error.response.data.errors;
  
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
  
        console.error(error);
        dispatch({ type: LOGIN_FAIL });
    }
  
  }

//Register User
export const register = ( userObj ) => async dispatch => {
    
  try {

    const res = await axios.post('/api/users', userObj);
    
    dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
    })
      
  } catch (error) {
    
      const errors = error.response.data.errors;

      if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
      }

      console.error(error);
      dispatch({ type: REGISTER_FAIL });
  }

}

// Logout // clear profile
export const logout = () => dispatch => {
    dispatch({ type: CLEAR_PROFILE })
    dispatch({ type: LOG_OUT })
}