import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import ProfileTop from './ProfileTop'
import ProfileAbout from './ProfileAbout'
import ProfileExperience from './ProfileExperience'
import ProfileCertifications from './ProfileCertifications'
import ProfileGithub from './ProfileGithub'
import { getProfileById } from '../../actions/profile'


const Profile = ({ getProfileById, match, profile: { profile, loading }, auth }) => {
  
  useEffect(() => {
    getProfileById(match.params.id)
  }, [getProfileById])
  
  console.log(profile);
  return (
    
    <>
      {profile === null || loading === true ?

        <Spinner />
        :
        <>
          <Link to='/profiles' className='btn btn-light' >
            Back to Profiles
          </Link>
          {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id && (
            <Link to='edit-profile' className='btn btn-dar'>
              Edit Profile
            </Link>
          )}
          <div className="profile-grid my-1">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {profile.experience.length > 0 ?
                (
                  <>
                    {profile.experience.map(exp => (
                      <ProfileExperience key={exp._id} experience={exp} />
                    ))}
                  </>
                )
                :
                (<h4>No experience credentials</h4>)
              }
            </div>
            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Certifications</h2>
              {profile.certifications && profile.certifications.length > 0 ?
                (
                  <>
                    {profile.certifications.map(edu => (
                      <ProfileCertifications key={edu._id} education={edu} />
                    ))}
                  </>
                )
                :
                (<h4>No experience credentials</h4>)
              }
            </div>
            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername}/>
            )}
             
          </div>
        </>
      }
    </>
  )
}

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
})

export default connect(mapStateToProps, { getProfileById })(Profile)
