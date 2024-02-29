const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('firstName') // Add validation for firstName
    .exists({ checkFalsy: true })
    .withMessage('Please provide a first name.'),
  check('lastName') // Add validation for lastName
    .exists({ checkFalsy: true })
    .withMessage('Please provide a last name.'),
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

  const { email, password, username,firstName,lastName } = req.body;
  // It's recommended to use bcrypt's async function here for production use
  const hashedPassword =bcrypt.hashSync(password, 10); // The second argument is the salt round


    const user = await User.create({
      firstName,
      lastName,
      email,
      username,
      hashedPassword,
    });

    const safeUser = {
      id: user.id,
      firstName,
      lastName,
      email: user.email,
      username: user.username,
    };

    // Log the user in by setting a JWT cookie
    await setTokenCookie(res, safeUser);

    return res.json({
      user: safeUser
    });
  }
);


module.exports = router;
