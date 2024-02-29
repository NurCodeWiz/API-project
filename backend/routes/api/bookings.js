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

//edit booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params
    const { startDate, endDate } = req.body
    const bookings = await Booking.findByPk(bookingId)


    if (!bookings) {
        return res.status(404).json({
            message: "Booking couldn't be found"
        })
    }

    let currentDate = new Date()
    if (new Date(startDate) < currentDate || new Date(endDate) < currentDate) {
        return res.status(403).json({
            message: "Past bookings can't be modified"
        })
    }

    if (new Date(startDate) < currentDate) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                startDate: "startDate cannot be in the past"
            }
        })
    }
    if (new Date(endDate) <= new Date(startDate)) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                endDate: "endDate cannot be on or before startDate"
            }
        })
    }
    const reservedSpot = await Booking.findOne({
        where: {
            id: {
                [Op.ne]: bookingId
            },
            spotId: bookings.spotId,
            [Op.and]:
                [
                    {
                        startDate: {
                            [Op.lte]: new Date(endDate)
                        }
                    },
                    {
                        endDate: {
                            [Op.gte]: new Date(startDate)
                        }
                    }
                ]
        }
    })

    if (reservedSpot) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            }
        })
    }


    if (req.user.id !== bookings.userId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    bookings.startDate = startDate
    bookings.endDate = endDate
    await bookings.save()

    res.json(bookings)

})

//delete booking

router.delete('/:bookingId', requireAuth, async (req, res) => {
    const { bookingId } = req.params
    const bookings = await Booking.findByPk(bookingId)
    if (!bookings) {
        return res.status(404).json({
            message: "Booking couldn't be found"
        })
    }
     if (bookings.userId !== req.user.id) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }
    if (new Date(bookings.startDate) <= new Date()) {
        return res.status(403).json({
            message: "Bookings that have been started can't be deleted"
        })
    }

    await bookings.destroy()
    res.json({
        message: "Successfully deleted"
    })
})



















module.exports = router;
