import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';


const Dashboard = ({ deleteAccount, getCurrentProfile, auth: { user }, profile: { profile, loading } }) => {

  useEffect(() => {
    getCurrentProfile();
  }, []);

  return (loading === true && profile === null  )  ? <Spinner />
    :
    (
      <>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
          <i className="fas fa-user">Welcome {user && user.name}</i>
        </p>
        {profile !== null ?
          <>
           <DashboardActions/>
           <Experience experience={profile.experience} />
           <Education education={profile.certifications} />

           <div className="my-2">
             <button onClick={()=>deleteAccount()}className="btn btn-danger">
               <i className="fas fa-user-minus"></i>Delete My Account
             </button>
           </div>
          </>
          :
          <>
            <p>You have not yet set up a profile. Please create one.</p>
            <Link to='/create-profile' className="btn btn-primary my-1">Create Profile</Link>
          </>
        }
      </>
    )
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired,

}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard)
