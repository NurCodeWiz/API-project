'use strict';
/** @type {import('sequelize-cli').Migration} */
const { Review } = require('../models')
let options = { tableName: 'Reviews'}
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
    await Review.bulkCreate([
    {
      spotId:2,
      userId:1,
      review: 'Would not come again',
      stars: 1
    },
    {
      spotId:4,
      userId:3,
      review: 'Great place to relax , highly recommended.',
      stars: 5
    },
    {
      spotId:5,
      userId:2,
      review: 'Well worth the travels',
      stars: 4
    },
    {
      spotId:3,
      userId:1,
      review: 'It\'s really really cold. Get your blankets',
      stars: 3
    },
    {
      spotId:7,
      userId:3,
      review: 'It was awesome.',
      stars: 4
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
    }, {})
  }
};
