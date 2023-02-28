const { User } = require('../models');
const _ = require('lodash');
const { Op } = require('sequelize');

module.exports = {
    async getUsers(req, res) {
        const defaultLimit = 20;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit) || defaultLimit;
        const search = _.trim(req.query.filter);
        const offset = limit && page ? (page - 1) * limit : null;
        const query = {
            limit,
        };

        if (offset) query.offset = offset;
        if (search) {
            query.where = {
                [Op.or]: [
                    {
                        email: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        role: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        lastName: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        firstName: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                ],
            };
        }

        try {
            const users = await User.findAll(query);
            return res.send({
                users,
            });
        } catch (e) {
            return res.status(400).send({
                error: 'Error ocurred during getting users',
            });
        }
    },
};
