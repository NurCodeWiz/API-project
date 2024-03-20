import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './ProfileButton-bonus.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const nav = useNavigate()
  const currUser = useSelector((state) => state.session.user)


  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };


    document.addEventListener('click', closeMenu);


    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = () => {
    dispatch(sessionActions.logout());
    // setShowMenu(false);
    closeMenu();
    nav('/')

  };


  const ulClassName = `profile-dropdown${showMenu ? " show" : " hide"}`;

  let manageRoute = () => {
    nav('/spots/current')
  }


  return (
    <div className="profile-container">
      <button onClick={toggleMenu} className="profile-button">
        <i className="fas fa-user-circle"></i>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>{user.username}</li>
            <li>Hello, {user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <hr/>
              {currUser && (
                <div className='ManageSpots-container'>
                  <Link to='/spots/current' className='Manage-text' onClick={manageRoute}>Manage Spots</Link>
                </div>)}
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <OpenModalButton buttonText="Log In" onItemClick={closeMenu} modalComponent={<LoginFormModal />} />
            </li>
            <li>
              <OpenModalButton buttonText="Sign Up" onItemClick={closeMenu}  modalComponent={<SignupFormModal />} />
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
