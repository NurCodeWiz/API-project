'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Spot } = require('../models')
let options = { tableName: 'Spots'}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 40,
        address: '123 Adventure Road',
        city: 'Exploria',
        state: 'Discovery',
        country: 'Imaginaria',
        lat: 80,
        lng: -144,
        name: 'Adventure Base Camp',
        description: 'The perfect starting point for your adventures in Imaginaria. Explore the unexplored!',
        price: 10.99


      },
      {
        ownerId: 41,
        address: '456 Serenity Blvd',
        city: 'Tranquilita',
        state: 'Peace',
        country: 'Utopia',
        lat: 80,
        lng: -150,
        name: 'Serenity Now',
        description: 'A tranquil retreat in the heart of Utopia. Find your peace and quiet here.',
        price: 300.99
      },
      {
        ownerId: 42,
        address: '789 Cultural Lane',
        city: 'Heritaga',
        state: 'Tradition',
        country: 'Historyland',
        lat: 70,
        lng: 60,
        name: 'Cultural Heritage Site',
        description: 'Immerse yourself in the rich history and culture of Historyland. A journey through time.',
        price: 999.99
      },
      {
        ownerId: 41, // Assuming similar ownerId for simplicity
        address: '101 Fantasy Land',
        city: 'Dreamville',
        state: 'Imagination',
        country: 'Fantasia',
        lat: 78,
        lng: -150,
        name: 'Dreamy Meadows',
        description: 'Escape to a land where dreams come true, amidst meadows that whisper tales of old.',
        price: 150.99

      },
      {
        ownerId: 42,
        address: '404 Sky Heights',
        city: 'Cloud Nine',
        state: 'Elevation',
        country: 'Skyland',
        lat: 88,
        lng: -100,
        name: 'Heavenly Abode',
        description: 'Elevate to euphoria in Cloud Nine. A heavenly abode that touches the sky.',
        price: 1.99
      },
      {
        ownerId: 40,
        address: '303 Crystal Lake',
        city: 'Reflection',
        state: 'Clarity',
        country: 'Serenity',
        lat: 60,
        lng: -120,
        name: 'Lakeview Retreat',
        description: 'Find clarity and peace by the serene Crystal Lake. Reflections that tell stories of the soul.',
        price: 500.99

      },
      {
        ownerId: 41,
        address: '202 Mystic Woods',
        city: 'Enigma',
        state: 'Mystery',
        country: 'Arcania',
        lat: 78,
        lng: -178,
        name: 'Mystic Cabin',
        description: 'Unravel mysteries in the heart of Mystic Woods. A cabin that holds secrets of the arcane.',
        price: 72.99

      }
    ],options,{validate:true})
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
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
      ownerId: { [Op.in]: [40,41,42]}
    })
  }
};
