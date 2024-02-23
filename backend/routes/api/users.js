const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

router.post('/',validateSignup, async (req, res) => {

  const { email, password, username } = req.body;
  // It's recommended to use bcrypt's async function here for production use
  const hashedPassword =bcrypt.hashSync(password, 10); // The second argument is the salt round

  try {
    const user = await User.create({
      email,
      username,
      hashedPassword,
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    // Log the user in by setting a JWT cookie
    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  } catch (error) {
    // Handle potential errors, such as email already in use
    return res.status(400).json({
      message: "Unable to register user.",
      errors: error.errors || [{ message: error.message }]
    });
  }
});

module.exports = router;
