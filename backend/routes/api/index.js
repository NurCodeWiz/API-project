const express = require('express');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require('../../utils/auth.js');

const router = express.Router();
router.use('/api/session', sessionRouter);
router.use('/api/users', usersRouter);

// Connect restoreUser middleware
router.use(restoreUser);

// Connect session router
router.use('/session', sessionRouter);

// Connect users router
router.use('/users', usersRouter);

// Test route
router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});


module.exports = router;
