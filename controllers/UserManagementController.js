const { User } = require('../models');
const _ = require('lodash');
const { Op } = require('sequelize');
const moment = require('moment');

module.exports = {
    async getUsers(req, res) {
        const defaultLimit = 20;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit) || defaultLimit;
        const search = _.trim(req.query.filter);
        const offset = limit && page ? (page - 1) * limit : null;
        const query = {
            limit,
            where: {
                role: {
                    [Op.not]: 'admin',
                },
            },
        };

        if (offset) query.offset = offset;
        if (search) {
            query.where = {
                ...query.where,
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
            const users = await User.findAndCountAll(query);
            return res.send({
                users,
            });
        } catch (e) {
            return res.status(400).send({
                error: 'Error ocurred during getting users',
            });
        }
    },
    async getUsersCSV(req, res) {
        const query = {
            where: {
                role: {
                    [Op.not]: 'admin',
                },
            },
        };
        try {
            const users = await User.findAll(query);
            // initializing the CSV string content with the headers
            let csvData =
                [
                    'User ID',
                    'User Name',
                    'Email Address',
                    'Location',
                    'Role',
                    'Last Active',
                ].join(',') + '\r\n';

            users.forEach(
                ({
                    id,
                    firstName,
                    lastName,
                    email,
                    location,
                    role,
                    updatedAt,
                }) => {
                    // populating the CSV content
                    // and converting the null fields to ""
                    csvData +=
                        [
                            id,
                            `${firstName} ${lastName}`,
                            email,
                            String(location).toUpperCase(),
                            role,
                            moment(updatedAt).format('L'),
                        ].join(',') + '\r\n';
                }
            );

            // returning the CSV content via the "users.csv" file
            return res
                .set({
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="users.csv"`,
                })
                .send(csvData);
        } catch (e) {
            return res.status(400).send({
                error: 'Error ocurred during getting users',
            });
        }
    },
};
