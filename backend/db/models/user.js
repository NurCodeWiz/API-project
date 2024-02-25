'use strict';

const { Model, Validator } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Create a method to safely return user data without the hashed password
    toSafeObject() {
      const { id, username, email,firstName,lastName } = this; // context will be the user instance
      return { id, username, email,firstName,lastName };
    }

    // Validate password method
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }

    // Static method to get the current user by id with default scope
    static getCurrentUserById(id) {
      return User.scope('defaultScope').findByPk(id);
    }

    // Static method for login
    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential,
          },
        },
      });
      if (user && user.validatePassword(password)) {
        return user;
      }
    }

    // Static method for signup
    static async signup({ username, email, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        hashedPassword,
        firstName,
        lastName,
      });
      return user;
    }

    // Define association here if necessary
    static associate(models) {
      User.hasMany(models.Spot,{
        foreignKey:'ownerId',
        onDelete: 'CASCADE',
        hooks: true
      });

      User.hasMany(models.Booking, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true
      });

      User.hasMany(models.Review, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks: true
      });

      // Define associations here
      // Example: User.hasMany(models.Post);
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error('Cannot be an email.');
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true,
      },
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60],
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    }

  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt'],
      },
    },
    scopes: {
      // Include additional scopes as needed
      loginUser: {
        attributes: {},
      },
      currentUser: {
        attributes: { exclude: ['hashedPassword'] },
      },
    },
  });

  return User;
};
