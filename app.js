require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const { sequelize } = require('./models');
const scheduleJobs = require('./schedule/scheduleJobs');

const domainsFromEnv = process.env.CORS_DOMAINS || '';
const whitelist = domainsFromEnv.split(',').map((item) => item.trim());
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
    const morgan = require('morgan');
    app.use(morgan('combined'));
}

require('./passport');
require('./routes')(app);

const initApp = async () => {
    console.log('Testing the database connection..');
    try {
        await sequelize.authenticate();
        const port = process.env.PORT || '3001';
        app.listen(port);
        scheduleJobs.initScheduledJobs();
        console.log(`Server is up and running at: http://localhost:${port}`);
    } catch (error) {
        console.log(`Server do not started because: ${error}`);
    }
};

/**
 * Initialize the application.
 */
initApp();
