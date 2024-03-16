import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './ProfileButton-bonus.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

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

  const logout = () => {
    dispatch(sessionActions.logout());
    setShowMenu(false);
  };


  const ulClassName = `profile-dropdown${showMenu ? " show" : " hide"}`;

  return (
    <div className="profile-container">
      <button onClick={toggleMenu} className="profile-button">
        <i className="fas fa-user-circle"></i>
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>{user.username}</li>
            <li>{user.firstName} {user.lastName}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <OpenModalButton buttonText="Log In" modalComponent={<LoginFormModal />} />
            </li>
            <li>
              <OpenModalButton buttonText="Sign Up" modalComponent={<SignupFormModal />} />
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
