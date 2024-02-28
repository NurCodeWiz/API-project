const express = require('express');
const bcrypt = require('bcryptjs');
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { handleValidationErrors } = require('../../utils/validation')
const { Op } = require('sequelize');
const { check } = require('express-validator');//package that collect errors and save as array

const router = express.Router();


//paginaton

const validateFilters = [
    check('page')
        .optional()
        .isInt({min:1, max:10})
        .withMessage("Page must be greater than or equal to 1"),
    check('size')
        .optional()
        .isInt({min:1, max:20})
        .withMessage("Size must be greater than or equal to 1"),
    check('minLat')
        .isFloat({min: -90, max: 90})
        .optional()
        .withMessage("Minimum latitude is invalid"),
    check('maxLat')
        .isFloat({min: -90, max: 90})
        .optional()
        .withMessage("Maximum latitude is invalid"),
    check('minLng')
        .isFloat({min:-180, max:180})
        .optional()
        .withMessage("Maximum longitude is invalid"),
    check('maxLng')
        .isFloat({min:-180, max:180})
        .optional()
        .withMessage("Minimum longitude is invalid"),
    check('minPrice')
        .isFloat({min:0})
        .optional()
        .withMessage("Minimum price must be greater than or equal to 0"),
    check('maxPrice')
        .isFloat({min: 0})
        .optional()
        .withMessage("Maximum price must be greater than or equal to 0"),
    handleValidationErrors
    ]

    const valitReviews = [
        check('review')
            .exists({ checkFalsy: true })
            .withMessage("Review text is required"),
        check('stars')
            .isInt({ min: 1, max: 5 })
            .withMessage("Stars must be an integer from 1 to 5"),
        handleValidationErrors
    ]


    //get spots by current user
    router.get('/current', requireAuth, async (req, res) => {
        const ownerId = req.user.id;

        // Fetch all spots owned by the current user
        const spots = await Spot.findAll({
            where: { ownerId: ownerId },
        });

        for (const spot of spots) {
            // Calculate average rating for each spot
            const reviews = await Review.findAll({
                where: { spotId: spot.id },
                attributes: ['stars']
            });

            let avgRating = reviews.reduce((acc, { stars }) => acc + stars, 0) / reviews.length;
            avgRating = isNaN(avgRating) ? 0 : avgRating; // Handle case with no reviews
            spot.dataValues.avgRating = avgRating;

            // Fetch preview image for each spot
            const previewImage = await SpotImage.findOne({
                where: { spotId: spot.id },
                attributes: ['url']
            });

            spot.dataValues.previewImage = previewImage ? previewImage.url : null;


            spot.dataValues.lat = parseFloat(spot.lat);
            spot.dataValues.lng = parseFloat(spot.lng);
            spot.dataValues.price = parseFloat(spot.price);
        }

        res.json({ Spots: spots });
    });

    const valitSpots = [
        check('address')
            .exists({ checkFalsy: true })
            .withMessage('Street Address is required'),
        check('city')
            .exists({ checkFalsy: true })
            .withMessage('City is required'),
        check('state')
            .exists({ checkFalsy: true })
            .withMessage('State is required'),
        check('country')
            .exists({ checkFalsy: true })
            .withMessage('Country is required'),
        check('lat')
            .isFloat({ min: -90, max: 90 })
            .withMessage("Latitude must be within -90 and 90"),
        check('lng')
            .isFloat({ min: -180, max: 180 })
            .withMessage("Longitude must be within -180 and 180"),
        check('name')
            .isLength({ max: 50 })
            .withMessage("Name must be less than 50 characters"),
        check('description')
            .exists({ checkFalsy: true })
            .withMessage("Description is required"),
        check('price')
            .isFloat({ min: 0 })
            .withMessage("Price per day must be a positive number"),
        handleValidationErrors
    ]
    // Edit a spot
    router.put('/:spotId', [requireAuth, valitSpots], async (req, res) => {
        const { spotId } = req.params;
        const updateData = req.body;

        try {
            const spot = await Spot.findByPk(spotId);

            if (!spot) {
                return res.status(404).json({ message: "Spot couldn't be found" });
            }

            // Check ownership
            if (req.user.id !== spot.ownerId) {
                return res.status(403).json({ message: "Forbidden" });
            }


            const updatedSpot = await spot.update(updateData);

            res.json(updatedSpot);
        } catch (error) {
            console.error('Error updating spot:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // Add an Image to a Spot based on the Spot's id
    async function addImageToSpot(userId, spotId, imageUrl, isPreview) {
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return { error: true, status: 404, message: "Spot couldn't be found" };
        }

        if (userId !== spot.ownerId) {
            return { error: true, status: 403, message: "Forbidden" };
        }

        const spotImage = await SpotImage.create({
            spotId: spotId,
            url: imageUrl,
            preview: isPreview,
        });

        return {
            error: false,
            spotImage: {
                id: spotImage.id,
                url: spotImage.url,
                preview: spotImage.preview,
            },
        };
    }

    router.post('/:spotId/images', requireAuth, async (req, res) => {
        const { url, preview } = req.body;
        const { spotId } = req.params;
        const userId = req.user.id;

        const result = await addImageToSpot(userId, spotId, url, preview);

        if (result.error) {
            return res.status(result.status).json({ message: result.message });
        }

        res.json(result.spotImage);
    });


    //Get details of a Spot from an id
    async function getSpotDetailsById(spotId) {
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return null;
        }

        const numReviews = await Review.count({
            where: { spotId }
        });

        const stars = await Review.sum('stars', {
            where: { spotId }
        });

        let avgRating = stars && numReviews ? stars / numReviews : 0;

        const imgurl = await SpotImage.findAll({
            where: { spotId },
            attributes: ['id', 'url', 'preview']
        });

        const owner = await User.findByPk(spot.ownerId, {
            attributes: ['id', 'firstName', 'lastName']
        });

        // Set additional properties to the spot object
        spot.setDataValue('numReviews', numReviews);
        spot.setDataValue('avgStarRating', avgRating.toFixed(1));
        spot.setDataValue('SpotImages', imgurl);
        spot.setDataValue('Owner', owner);


        ['lat', 'lng', 'price'].forEach(key => {
            if (spot[key]) spot[key] = parseFloat(spot[key]);
        });

        return spot;
    }
    router.get('/:spotId', async (req, res) => {
        const { spotId } = req.params;
        const spotDetails = await getSpotDetailsById(spotId);

        if (!spotDetails) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        res.json(spotDetails);
    });

    //delete spot
    router.delete('/:id', requireAuth, async (req, res) => {
        const spotId = req.params.id;
        const currentUserId = req.user.id;

        const spot = await Spot.findOne({
            where: {
                id: spotId,
                ownerId: currentUserId
            }
        });

        if (!spot) {
            return res.status(404).json({ "message": "Spot couldn't be found" });
        }

        await spot.destroy();


        return res.status(200).json({ "message": "Successfully deleted" });
    });

    //Get all Reviews by a Spot's id
    router.get('/:spotId/reviews', async (req, res) => {
        const { spotId } = req.params;


        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const reviews = await Review.findAll({
            where: { spotId: spotId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url'],
                }
            ],
            order: [['createdAt', 'DESC']],
        });


        const formattedReviews = reviews.map(review => ({
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            User: review.User,
            ReviewImages: review.ReviewImages,
        }));

        return res.status(200).json({ Reviews: formattedReviews });
    });

    //Create a Review for a Spot based on the Spot's id
    router.post('/:spotId/reviews', [requireAuth, valitReviews], async (req, res) => {
        const { spotId } = req.params;
        const { review, stars } = req.body;
        const userId = req.user.id;

        try {

            const spot = await Spot.findByPk(spotId);
            if (!spot) {
                return res.status(404).json({ "message": "Spot couldn't be found" });
            }


            const existingReview = await Review.findOne({
                where: { spotId, userId },
            });
            if (existingReview) {
                return res.status(500).json({ "message": "User already has a review for this spot" });
            }


            const newReview = await Review.create({
                userId,
                spotId,
                review,
                stars
            });


            const response = {
                id: newReview.id,
                userId: newReview.userId,
                spotId: newReview.spotId,
                review: newReview.review,
                stars: newReview.stars,
                createdAt: newReview.createdAt,
                updatedAt: newReview.updatedAt
            };
            return res.status(201).json(response);
        } catch (error) {

            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors.map(e => e.message)
                });
            }
            console.error("Error creating review:", error);
            return res.status(500).json({ "message": "Internal server error" });
        }
    });




    //create spot
    router.post('/', [requireAuth, validateFilters], async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body

        const spot = await Spot.create({
            ownerId: req.user.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })

        if (spot.lat) spot.lat = parseFloat(lat)
        if (spot.lng) spot.lng = parseFloat(lng)
        if (spot.price) spot.price = parseFloat(price)

        res.status(201).json(spot)

    })


//getting all spots
router.get('/', validateFilters, async (req,res) => {

    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    let queryObj = {
        where: {}
    }

    if(!page || (parseInt(page) == NaN)) page = 1;
    if(!size || (parseInt(size) == NaN)) size = 20;

    queryObj.limit = size;
    queryObj.offset = size * (page - 1);

    if(minLat){
        queryObj.where.lat = {
            [Op.gte]: parseFloat(minLat)
        }
    }
    if(maxLat){
        queryObj.where.lat = {
            [Op.lte]: parseFloat(maxLat)
        }
    }
    if(minLng){
        queryObj.where.lng = {
            [Op.gte]: parseFloat(minLng)
        }
    }
    if(maxLng){
        queryObj.where.lng = {
            [Op.lte]: parseFloat(maxLng)
        }
    }
    if(minPrice){
        queryObj.where.price = {
            [Op.gte]: parseFloat(minPrice)
        }
    }
    if(maxPrice){
        queryObj.where.price = {
            [Op.lte] : parseFloat(maxPrice)
        }
    }

    const spots = await Spot.findAll({...queryObj})
    let spotArr = []
    for(let spot of spots){
        const reviews = await Review.findAll({
            where: {
                spotId: spot.id
            }
        });

        let avgRating = 0
        reviews.forEach(review => {
            avgRating += review.stars
        })
        spot.dataValues.avgRating = parseFloat((avgRating/reviews.length).toFixed(1))
        if(isNaN(avgRating) || !avgRating){
            spot.dataValues.avgRating = 'No Rating'
        }

        const prevImg = await SpotImage.findOne({
            where: {
                spotId: spot.id
            }
        })
        if(!prevImg){
            spot.dataValues.previewImage = 'No Images'
        }
        else{
            spot.dataValues.previewImage = prevImg.url
        }

        const response = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: parseFloat(spot.lat),
            lng: parseFloat(spot.lng),
            name: spot.name,
            description: spot.description,
            price: parseFloat(spot.price),
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: spot.dataValues.avgRating,
            previewImage : spot.dataValues.previewImage
        }
        spotArr.push(response)
    }
    page = parseInt(page)
    size = parseInt(size)
    return res.status(200).json({Spots: spotArr, page:page, size: size})
})






module.exports = router;
