const express = require('express');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js')
const spotImagesRouter = require('./spot-images.js')
const reviewImagesRouter = require('./review-images.js')
const bookingsRouter = require('./bookings.js')
const { restoreUser } = require('../../utils/auth.js');



const router = express.Router();
router.use('/api/session', sessionRouter);
router.use('/api/users', usersRouter);

//test
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});
const { requireAuth } = require('../../utils/auth.js');
router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);

// Connect restoreUser middleware
router.use(restoreUser);

// Connect session router
router.use('/session', sessionRouter);

// Connect users router
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);

router.use('/api/session', sessionRouter);
router.use('/api/users', usersRouter);

// Test route
router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});


module.exports = router;
