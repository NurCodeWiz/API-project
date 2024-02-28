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
router.get("/current", requireAuth, async (req, res) => {
    const userReviews = await Review.findAll({
        where: { userId: req.user.id },
        include: [
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
            {
                model: Spot,
                attributes: { exclude: ['createdAt', 'updatedAt', 'description'] },
                include: [{
                    model: SpotImage,
                    where: { preview: true },
                    attributes: ['url'],
                    required: false
                }]
            },
            { model: ReviewImage, attributes: ['id', 'url'] }
        ]
    });

    const processedReviews = userReviews.map(review => {
        const reviewDetail = review.get({ plain: true });
        const previewImage = reviewDetail.Spot.SpotImages[0]?.url || null;


        Object.assign(reviewDetail.Spot, {
            previewImage: previewImage,
            lat: parseFloat(reviewDetail.Spot.lat),
            lng: parseFloat(reviewDetail.Spot.lng),
            price: parseFloat(reviewDetail.Spot.price)
        });

        delete reviewDetail.Spot.SpotImages;

        return reviewDetail;
    });

    res.json({ Reviews: processedReviews });
});

//Add an Image to a Review based on the Review's id

router.post('/:reviewId/images', requireAuth, async (req,res) => {
    const { reviewId } = req.params;
    const { url, preview } = req.body;

    let review = await Review.findByPk(reviewId);
    if(!review){
        return res.status(404).json({"message": "Review couldn't be found"})
    }
    if(review.userId !== req.user.id){
        return res.status(403).json({"message": "Forbidden"})
    }
    const countImg = await ReviewImage.findAll({
        where: {
            reviewId: reviewId
        }
    })

    if (countImg.length >= 10) {
        return res.status(403).json({
            message: "Maximum number of images for this resource was reached"
        })
    }

    let newImg = await ReviewImage.create({ reviewId: reviewId, url, preview });

    let response = {
        id: newImg.id,
        url: newImg.url
    }
    return res.status(200).json(response);
})





module.exports = router;
