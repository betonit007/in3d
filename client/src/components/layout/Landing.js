import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Landing = ({ isAuthenticated }) => {

    if(isAuthenticated) {
        return <Redirect to='/dashboard' /> 
    }

    return (
        <section className="landing">
        <div className="dark-overlay">
            <div className="landing-inner">
                <h1 className="x-large">In3d</h1>
                <p className="lead">Create profile and collaborate with other 3d Enthusiasts</p>
                <div className="buttons">
                    <Link to="/register" className="btn btn-primary">Sign Up</Link>
                    <Link to="/login" className="btn">Login</Link>
                </div>
            </div>
        </div>
    </section>
    )
}

Landing.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Landing)
