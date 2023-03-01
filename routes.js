const AuthenticationController = require('./controllers/AuthenticateController');
const UserManagementController = require('./controllers/UserManagementController');

const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy');
const UserManagementPolicy = require('./policies/UserManagementPolicy');

const UserAuthenticatedMiddleware = require('./middlewares/UserAuthenticated');
const HealthCheck = require('./helpers/healthcheck');

module.exports = (app) => {
    app.get('/', HealthCheck.healthCheckRoute);
    app.post(
        '/api/register',
        AuthenticationControllerPolicy.register,
        AuthenticationController.register
    );
    app.post(
        '/api/login',
        AuthenticationControllerPolicy.login,
        AuthenticationController.login
    );
    app.get(
        '/api/verification/:verificationToken',
        AuthenticationController.verifyToken
    );
    app.get(
        '/api/get-users',
        UserManagementPolicy.getUsersList,
        UserAuthenticatedMiddleware.userAuthenticated,
        UserManagementController.getUsers
    );
    app.get(
        '/api/get-users-csv',
        UserAuthenticatedMiddleware.userAuthenticated,
        UserManagementController.getUsersCSV
    );
    require('./error')(app);
};
