import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {

  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles">
          Modelers
        </Link>
      </li>
      <li>
        <Link to="/posts">
          Posts
        </Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user" />
          Dashboard</Link>
      </li>
      <li>
        <a onClick={logout} href='#!'>
          <i className="fas fa-sign-out-alt" />{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
    </ul>
  )

  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles">3d Modelers</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  )

  return (
    <div>
      <nav className="navbar bg-dark">
        <h1>
          <Link to="/" > In3d </Link>
        </h1>
        {!loading && (<>{isAuthenticated ? authLinks : guestLinks}</>)}
      </nav>
    </div>
  )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar);
