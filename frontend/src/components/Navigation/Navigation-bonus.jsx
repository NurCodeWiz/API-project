import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import { GiNestBirds } from 'react-icons/gi';
import './Navigation-bonus.css'

function Navigation({ isLoaded }) {
  const currentUser = useSelector((state) => state.session.user);

  return (
    <div className='TopNavContainer'>
      <NavLink to="/" className='HomeLogoLink'>
        <GiNestBirds size={60} />
      </NavLink>
      <h1 className="CozyNestsTitle">Cozy Nests</h1>
      <nav className='NavSection'>
        {currentUser && (
          <NavLink to='/spots/new' className='CreateSpotLink'>
            <span>Host</span>
            <span>Your</span>
            <span>Spot</span>
          </NavLink>
        )}
        <div className='ProfileLinkArea'>
          {isLoaded && (
            <ProfileButton user={currentUser} />
          )}
        </div>
      </nav>
    </div>
  );
}
export default Navigation;
