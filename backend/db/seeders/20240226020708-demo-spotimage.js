'use strict';

/** @type {import('sequelize-cli').Migration} */
const { SpotImage } = require('../models')
let options = { tableName: 'SpotImages'};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6OTkwNzc4Nzg4MzMxMzY1NjA5/original/2b337380-5d78-4e73-a306-659976b97cfe.jpeg?im_w=1200',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://pix8.agoda.net/hotelImages/289/289019/289019_14033116530018916569.jpg?ca=2&ce=1&s=1024x768',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://empire-s3-production.bobvila.com/slides/45183/vertical_slide_wide/iStock-1312034472.-old-homes-airbnb.jpg?1666061562',
        preview: true
      },
      {
        spotId: 4,
        url: 'https://cdn.openart.ai/stable_diffusion/ae0b8074e3b8b446a2e0deb44ffe23bceaee723f_2000x2000.webp',
        preview: true
      },
      {
        spotId: 5,
        url: 'https://cdn1.matadornetwork.com/blogs/1/2023/06/Convertible-A-frame-with-stargazing-hot-tub-and-stellar-views-3.jpg',
        preview: true
      },
      {
        spotId: 6,
        url: 'https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_1200/s3/2/154568/img_9085+(2).jpg',
        preview: true
      },
      {
        spotId: 7,
        url: 'https://media.cntraveler.com/photos/6346fb2a347783263a2f5e4c/16:9/w_2580%2Cc_limit/Airbnb%2520554961369602439078%2520-%25202.jpg',
        preview: true
      },

    ], options, { validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2,3,4,5,6]}
    })
  }
};
