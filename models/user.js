'use strict';
const bcrypt = require('bcrypt');

const { Model } = require('sequelize');

function hashPassword(user, options) {
    const SOLT_FACTOR = 8;
    if (!user.changed('password')) {
        return;
    }
    return bcrypt
        .genSalt(SOLT_FACTOR)
        .then((salt) => bcrypt.hash(user.password, salt, null))
        .then((hash) => {
            user.setDataValue('password', hash);
        });
}

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        comparePassword(pwd) {
            return bcrypt.compare(pwd, this.password);
        }
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate({ VerificationToken }) {
            this.hasOne(VerificationToken, {
                as: 'verificationToken',
                foreignKey: 'userId',
                foreignKeyConstraint: true,
            });
        }
    }
    User.init(
        {
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            firstName: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            lastName: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            location: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            role: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            isVerified: {
                defaultValue: false,
                type: DataTypes.BOOLEAN,
            },
            isActive: {
                defaultValue: false,
                type: DataTypes.BOOLEAN,
            },
        },
        {
            hooks: { beforeCreate: hashPassword, beforeUpdate: hashPassword },
            sequelize,
            tableName: 'users',
            modelName: 'User',
        }
    );
    return User;
};
