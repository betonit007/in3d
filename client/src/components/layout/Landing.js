import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
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

export default Landing
