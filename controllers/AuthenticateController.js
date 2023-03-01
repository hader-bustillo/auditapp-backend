const { User, VerificationToken } = require('../models');
const jwt = require('jsonwebtoken');

function jwtSignUser(user) {
    const ONE_WEEK = 60 * 60 * 24 * 7;
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: ONE_WEEK,
    });
}

module.exports = {
    async register(req, res) {
        try {
            await User.create({
                ...req.body,
                role: 'auditor',
            });
            return res.send({
                message: 'User created successfully',
            });
        } catch (e) {
            return res.status(400).send({
                error: 'This email address already in use.',
            });
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(400).send({
                    error: 'The login information was incorrect',
                });
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(400).send({
                    error: 'The login information was incorrect',
                });
            }

            return res.send({
                user: user.toJSON(),
                token: jwtSignUser(user.toJSON()),
            });
        } catch (e) {
            return res.status(500).json({
                error: 'An error has occured trying to lig in',
            });
        }
    },
    async verifyToken(req, res) {
        try {
            const { verificationToken } = req.params;
            const token = await VerificationToken.findOne({
                where: { token: verificationToken },
            });
            await User.update(
                { isVerified: true },
                { where: { id: token.userId } }
            );
            await token.destroy();

            return res.json({
                message: 'User verified successfully',
            });
        } catch (e) {
            return res.status(500).json({
                error: 'An error has occured trying to verify user',
            });
        }
    },
};
