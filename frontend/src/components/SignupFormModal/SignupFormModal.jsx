import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className='user-registration-container'>
      <h1 className='registration-title'>Sign Up</h1>
      <form className='registration-form' onSubmit={handleSubmit}>
        <label className='registration-field'>
          Email
          <input
            className='registration-input'
            type="text"
            value={email}
            // placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className='registration-error'>{errors.email}</p>}
        <label className='registration-field'>
          Username
          <input
            className='registration-input'
            type="text"
            value={username}
            // placeholder='Username'
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className='registration-error'>{errors.username}</p>}
        <label className='registration-field'>
          First Name
          <input
            className='registration-input'
            type="text"
            value={firstName}
            // placeholder='First Name'
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className='registration-error'>{errors.firstName}</p>}
        <label className='registration-field'>
          Last Name
          <input
            className='registration-input'
            type="text"
            value={lastName}
            // placeholder='Last Name'
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className='registration-error'>{errors.lastName}</p>}
        <label className='registration-field'>
          Password
          <input
            className='registration-input'
            type="password"
            value={password}
            // placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className='registration-error'>{errors.password}</p>}
        <label className='registration-field'>
          Confirm Password
          <input
            className='registration-input'
            type="password"
            value={confirmPassword}
            // placeholder='Confirm Password'
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p className='registration-error'>{errors.confirmPassword}</p>}
        <button
          type="submit"
          className='registration-submit'
          disabled={username.length < 4 || password.length < 6 || !firstName || !lastName || !email || !confirmPassword}
        >Sign Up</button>
      </form>
    </div>



  );
}

export default SignupFormModal;
