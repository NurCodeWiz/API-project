'use strict';

/** @type {import('sequelize-cli').Migration} */
const { ReviewImage } = require('../models')
let options = { tableName: 'ReviewImages'}
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
    await ReviewImage.bulkCreate([
      {
        reviewId:1,
        url:'https://images.adsttc.com/media/images/5b6a/ec75/f197/cc94/5000/01e9/slideshow/16-042-018A.jpg?1533733997'
      },
      {
        reviewId:2,
        url:'https://snoopy.archdaily.com/images/archdaily/catalog/uploads/photo/image/334672/full_Home_Default_-_Western_Window_Systems.jpeg?width=2048&format=webp'
      },
      {
        reviewId:3,
        url:'https://muscleandhealth.com/wp-content/uploads/2023/09/ROMAN-HERO.jpg'
      },
      {
        reviewId:4,
        url:'https://a.travel-assets.com/findyours-php/viewfinder/images/res70/29000/29039-Magic-House-St-Louis-Childrens-Museum.jpg'
      }

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
      reviewId: { [Op.in]: [1,2,3,4]}
    }, {})
  }
};
