const express = require('express')
const { Spot, SpotImage, Review, ReviewImage, User,Booking } = require('../../db/models');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation')
const { Op } = require('sequelize');
const { check } = require('express-validator');

const router = express.Router();


const validateReviews = [
    check('review')
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
    check('stars')
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
]
//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;

    try {
        const userReviews = await Review.findAll({
            where: { userId: userId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                    include: [{
                        model: SpotImage,
                        attributes: ['url'],
                        where: { preview: true },
                        required: false
                    }]
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url'],
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        const formattedReviews = userReviews.map(review => {
            const reviewData = review.toJSON();

            reviewData.Spot.lat = parseFloat(reviewData.Spot.lat);
            reviewData.Spot.lng = parseFloat(reviewData.Spot.lng);
            reviewData.Spot.price = parseFloat(reviewData.Spot.price);
            reviewData.Spot.previewImage = reviewData.Spot.PreviewImage ? reviewData.Spot.PreviewImage[0]?.url : 'No Images';

            // Remove the PreviewImage array
            delete reviewData.Spot.PreviewImage;

            return reviewData;
        });

        res.json({ Reviews: formattedReviews });
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;
