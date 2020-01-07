import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

    const { email, password } = formData;

    const onSubmit = async e => {
        e.preventDefault();
        if (email && password) {
            login(formData);
        }
            
    }

    // Redirect if logged in
    if(isAuthenticated) {
        return <Redirect to='/dashboard' />
    }

    return (
        <>
            <h1 className="large text-primary">
                Sign In
        </h1>
            <p className="lead"><i className="fas fa-user"></i>
                Sign In To Your Account
        </p>
            <form action="dashboard.html" className="form" onSubmit={onSubmit}>
                <div className="form-group">
                    <input type="email"
                        value={email}
                        name='email'
                        placeholder='Email'
                        onChange={e => onChange(e)}
                        required
                    />
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
                <input type="submit" value="Login" className='btn btn-primary' /> 
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register" className="">Register</Link>
            </p>
        </>
    )
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})


export default connect(mapStateToProps, { login })(Login);
