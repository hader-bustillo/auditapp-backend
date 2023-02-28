'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.addColumn(
                    'users',
                    'role',
                    {
                        type: Sequelize.ENUM('admin', 'auditor'),
                        allowNull: false,
                        defaultValue: 'auditor',
                        after: 'location',
                    },
                    { transaction: t }
                ),
                queryInterface.addColumn(
                    'users',
                    'isActive',
                    {
                        type: Sequelize.BOOLEAN,
                        allowNull: false,
                        defaultValue: false,
                        after: 'role',
                    },
                    { transaction: t }
                ),
            ]);
        });
    },
    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction((t) => {
            return Promise.all([
                queryInterface.removeColumn('users', 'role', {
                    transaction: t,
                }),
                queryInterface.removeColumn('users', 'isActive', {
                    transaction: t,
                }),
            ]);
        });
    },
};
