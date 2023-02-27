const passport = require('passport');

module.exports = {
    userAuthenticated(req, res, next) {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if (err || !user) {
                res.status(403).send({
                    error: 'You do not have access to this resource',
                });
            } else {
                req.user = user;
                next();
            }
        })(req, res, next);
    },
};
