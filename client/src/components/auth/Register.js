import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';


const Register = ({ setAlert, register, isAuthenticated }) => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

    const { name, email, password, password2 } = formData;

    const onSubmit = async e => {
        e.preventDefault();
        if(password !== password2) {
            setAlert('Passwords do not match', 'danger')
        } else {
            const newUser = {
                name,
                email,
                password
            }

            try {

                register(newUser);

            } catch (error) {
                
            }
        }
    }

    if (isAuthenticated) {
        return <Redirect to='/dashboard' />
    }

    return (
        <>
            <h1 className="large text-primary">
                Sign Up
        </h1>
            <p className="lead"><i className="fas fa-user"></i>
                Create Your Account
        </p>
            <form action="dashboard.html" className="form" onSubmit={onSubmit}>
                <div className="form-group">
                    <input type="text"
                        value={name}
                        name='name'
                        placeholder='Name'
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input type="email"
                        value={email}
                        name='email'
                        placeholder='Email'
                        onChange={e => onChange(e)}
                        required
                    />
                    <small className="form-text">
                        This site uses Gravatar, so if you want a profile image, use a Gravatar email.
                </small>
                </div>
                <div className="form-group">
                    <input type="password"
                        value={password}
                        name='password'
                        placeholder='Password'
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input type="password"
                        value={password2}
                        name='password2'
                        placeholder='Confirm Password'
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <input type="submit" value="Register" className='btn btn-primary' /> 
            </form>
            <p className="my-1">
                Already have an account? <Link to='/login' className="">Log In</Link>
            </p>
        </>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, { register, setAlert })(Register);
