const express = require('express')
const { Spot, SpotImage, Review, User, Booking, ReviewImage } = require('../../db/models')
const { requireAuth, restoreUser } = require('../../utils/auth');
const { Op } = require('sequelize');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req,res) => {
    let { imageId } = req.params;
    let spotImg = await SpotImage.findByPk(imageId,{attributes:['id','spotId','url','preview']})

    if(!spotImg){
        return res.status(404).json({ "message": "Spot Image couldn't be found" })
    }
    let spot = await Spot.findByPk(spotImg.spotId)
    if(spot.ownerId !== req.user.id){
        return res.status(403).json({'message':'Forbidden'})
    }

    await spotImg.destroy();
    return res.status(200).json({ "message": "Successfully deleted" })
})






module.exports = router;
