const express = require('express');
const router = express.Router();
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

// Login route
router.post('/login', async (req, res, next) => {
  const { credential, password } = req.body;
  const user = await User.login({ credential, password });

  if (!user) {
    const err = new Error('Login failed');
    err.status = 401;
    err.title = 'Login failed';
    err.errors = ['The provided credentials were invalid.'];
    return next(err);
  }

  await setTokenCookie(res, user);

  return res.json({
    user: user.toSafeObject()
  });
});

// Sign up route
router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;
  const user = await User.signup({ email, username, password });

  await setTokenCookie(res, user);

  return res.json({
    user: user.toSafeObject()
  });
});

// Logout route
router.delete('/logout', (_req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'success' });
});

module.exports = router;
