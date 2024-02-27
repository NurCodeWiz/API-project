const express = require('express')

const { Spot, SpotImage, Review, ReviewImage, User } = require('../../db/models');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();








module.exports = router;
