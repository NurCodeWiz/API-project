import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton-bonus';
import { GiNestBirds } from 'react-icons/gi';
import './Navigation-bonus.css'

function Navigation({ isLoaded }) {
  const currentUser = useSelector((state) => state.session.user);

  // return (
  //   <header className='Navigation-Header'>
  //     <nav className='Navigation-Content'>
  //       <NavLink to="/" className='Navigation-HomeLogo'>
  //         <GiArrowWings size={30} />
  //       </NavLink>
  //       <div className='Navigation-Links'>
  //         {currentUser && (
  //           <NavLink to='/spots/new' className='Navigation-CreateSpot'>Host Your Spot</NavLink>
  //         )}
  //         <div className='Navigation-ProfileLink'>
  //           {isLoaded && (
  //             <ProfileButton user={currentUser} />
  //           )}
  //         </div>
  //       </div>
  //     </nav>
  //   </header>
  // );
  return (
    <div className='TopNavContainer'>
      <NavLink to="/" className='HomeLogoLink'>
        <GiNestBirds size={60} />
      </NavLink>
      <h1 className="CozyNestsTitle">Cozy Nests</h1>
      <nav className='NavSection'>
        {currentUser && (
          <NavLink to='/spots/new' className='CreateSpotLink'>Host Your Spot</NavLink>
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
