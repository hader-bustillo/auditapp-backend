const schedule = require('node-schedule');
const { Op } = require('sequelize');
const { User, VerificationToken } = require('../models');

exports.initScheduledJobs = () => {
    const job = schedule.scheduleJob('* * * * *', async function () {
        const date = new Date();
        const users = await User.findAll({
            include: [
                {
                    model: VerificationToken,
                    required: true,
                    as: 'verificationToken',
                    where: {
                        createdAt: {
                            [Op.lt]: date.setHours(date.getHours() - 1),
                        },
                    },
                },
            ],
        });
        VerificationToken.destroy({
            where: {
                id: users.map((user) => user.verificationToken.id),
            },
        });
        const userDeletedCount = await User.destroy({
            where: {
                id: users.map((user) => user.id),
            },
        });
        console.log(`${userDeletedCount} users deleted`);
    });
};
