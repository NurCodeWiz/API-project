const express = require('express')
const { Spot, SpotImage, Review, ReviewImage, User, Booking } = require('../../db/models');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");
const router = express.Router();

//get all bookings for current user
router.get('/current', requireAuth, async (req, res) => {
    const currentUserId = req.user.id;
    let compiledBookings = [];


    const bookings = await Booking.findAll({
        where: { userId: currentUserId },
        include: [{
            model: Spot,
            attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
        }]
    });

    for (let booking of bookings) {
        let bookingData = booking.toJSON();


        const previewImage = await SpotImage.findOne({
            where: { spotId: bookingData.Spot.id, preview: true }
        });


        bookingData.Spot.previewImage = previewImage ? previewImage.url : null;


        bookingData.Spot.lat = parseFloat(bookingData.Spot.lat);
        bookingData.Spot.lng = parseFloat(bookingData.Spot.lng);
        bookingData.Spot.price = parseFloat(bookingData.Spot.price);

        compiledBookings.push({
            id: bookingData.id,
            spotId: bookingData.spotId,
            Spot: bookingData.Spot,
            userId: bookingData.userId,
            startDate: bookingData.startDate,
            endDate: bookingData.endDate,
            createdAt: bookingData.createdAt,
            updatedAt: bookingData.updatedAt
        });
    }

    return res.status(200).json({ Bookings: compiledBookings });
});
















module.exports = router;
