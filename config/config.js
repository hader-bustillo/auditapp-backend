require('dotenv').config();

const config = {
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USERNAME,
    password: `${process.env.DB_PASSWORD}`,
    port: process.env.DB_PORT || '3306',
    database: process.env.DB_DATABASE,
    dialect: 'mysql',
    logging: process.env.NODE_ENV !== 'production' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    },
};

module.exports = {
    development: config,
    test: config,
    production: config,
};
