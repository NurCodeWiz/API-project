const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/index');

const { secret, expiresIn } = jwtConfig;

const setTokenCookie = (res, user) => {
  const token = jwt.sign(
    { data: user.toSafeObject() },
    secret,
    { expiresIn: parseInt(expiresIn) }// 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    maxAge: expiresIn * 1000,// maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && 'Lax'
  });

  return token;
};

module.exports = { setTokenCookie };
