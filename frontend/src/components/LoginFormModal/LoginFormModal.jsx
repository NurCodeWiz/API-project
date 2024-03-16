import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const isFormValid = credential.length >= 4 && password.length >= 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };


  const handleDemoLogin = (e) => {
    e.preventDefault();
    attemptLogin({
      credential: 'demo@user.io',
      password: 'password'
    });
  };

  const attemptLogin = ({ credential, password }) => {
    setErrors({}); // Reset errors before attempting a login
    dispatch(sessionActions.login({ credential, password }))
      .then(closeModal) // Close the modal on successful login
      .catch(async (res) => {
        // Handle the failed login attempt
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors); // Update the errors state
        }
      });
  };

  return (
    <div className="login-form-modal-container">
      <h1 className="login-form-modal-title">Log In</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-form-row">
          <div className="login-form-group">
            <label className="login-form-label">
              Username or Email
              <input
                className='login-form-input'
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="login-form-group">
            <label className="login-form-label">
              Password
              <input
                className='login-form-input'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
        </div>
        {errors.credential && <p className="login-form-error">{errors.credential}</p>}
        <div className="login-form-actions">
          <button type="submit" className="login-form-btn" disabled={!isFormValid}>Log In</button>
          <button type="button" className="login-form-btn demo" onClick={handleDemoLogin}>Log In as Demo User</button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
