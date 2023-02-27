'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VerificationToken extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate({ User }) {
          this.belongsTo(User, {
              as: 'user',
              foreignKey: 'userId',
              foreignKeyConstraint: true,
          });
      }
  }
  VerificationToken.init(
      {
          userId: {
              allowNull: false,
              type: DataTypes.INTEGER,
          },
          token: {
              allowNull: false,
              type: DataTypes.STRING,
          },
      },
      {
          sequelize,
          tableName: 'verification_token',
          modelName: 'VerificationToken',
      }
  );
  return VerificationToken;
};