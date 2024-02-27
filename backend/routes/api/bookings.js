const express = require('express')

const { Spot, SpotImage, Review, ReviewImage, User, Booking } = require('../../db/models');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Op } = require("sequelize");

const router = express.Router();














module.exports = router;
