import axios from 'axios';
import { setAlert } from './alert';
import { GET_POSTS, POSTS_ERROR, UPDATE_PROFILE, UPDATE_LIKES, DELETE_POST, SET_ALERT, ADD_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT } from './types'

//Get Posts
export const getPosts = () => async dispatch => {
    try {
        
        const res = await axios.get('/api/posts');

        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: POSTS_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
          })
    }
}

//Get Single Post
export const getPost = id => async dispatch => {
    try {
        
        const res = await axios.get(`/api/posts/${id}`);

        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: POSTS_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
          })
    }
}

//Add like
export const addLike = id => async dispatch => {
    try {
        
        const res = await axios.put(`/api/posts/like/${id}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data }
        })
    } catch (error) {
        dispatch({
            type: POSTS_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
          })
    }
}

//Remove like
export const removeLike = id => async dispatch => {
    try {
        
        const res = await axios.put(`/api/posts/unlike/${id}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: { id, likes: res.data }
        })
    } catch (error) {
        dispatch({
            type: POSTS_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
          })
    }
}

// Delete Post
export const deletePost = id => async dispatch => {
    try {
        
        const res = await axios.delete(`/api/posts/${id}`);

        dispatch({
            type: DELETE_POST,
            payload: id
        })

        dispatch(setAlert('Post Removed', 'success'));

    } catch (error) {
        dispatch({
            type: POSTS_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
          })
    }
}

// ADD Post
export const addPost = formData => async dispatch => {
    try {
        
        const res = await axios.post(`/api/posts`, formData);

        dispatch({
            type: ADD_POST,
            payload: res.data
        })

        dispatch(setAlert('Post Created', 'success'));

    } catch (error) {
        dispatch({
            type: POSTS_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
          })
    }
}

// ADD Comment
export const addComment = (formData, postId) => async dispatch => {

    console.log(formData)
    try {
        
        const res = await axios.post(`/api/posts/comment/${postId}`, formData);

        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })

        dispatch(setAlert('Comment Created', 'success'));

    } catch (error) {
        dispatch({
            type: POSTS_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
          })
    }
}

// Delete Comment
export const deleteComment = (postId, commentId) => async dispatch => {
    try {
        
        const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

        dispatch({
            type: REMOVE_COMMENT,
            payload: res.data
        })

        dispatch(setAlert('Comment deleted', 'success'));

    } catch (error) {
        dispatch({
            type: POSTS_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
          })
    }
}