const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

router.post('/', async (req, res) => {
  console.log(req.body);
  const { email, password, username } = req.body;
  // It's recommended to use bcrypt's async function here for production use
  const hashedPassword = bcrypt.hashSync(password, 10); // The second argument is the salt round

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
