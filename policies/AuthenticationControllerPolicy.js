const Joi = require('joi');

module.exports = {
    register(req, res, next) {
        const schema = Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string()
                .required()
                .regex(new RegExp('^[a-zA-Zа-яА-ЯёЁ0-9]{8,32}$')),
            firstName: Joi.string().alphanum().min(3).max(30).required(),
            lastName: Joi.string().alphanum().min(3).max(30).required(),
            location: Joi.string().alphanum().required(),
            confirmPassword: Joi.string()
                .required()
                .valid(Joi.ref('password'))
                .messages({ 'any.only': '{{#label}} does not match' }),
        });
        schema
            .validateAsync(req.body)
            .then(() => {
                next();
            })
            .catch((err) => {
                switch (err.details[0].context.key) {
                    case 'email':
                        res.status(400).send({
                            error: 'You must provide a valid email address',
                        });
                        break;
                    case 'password':
                        res.status(400).send({
                            error: `The password match was failed`,
                        });
                        break;
                    case 'confirmPassword':
                        res.status(400).send({
                            error: `It must matched to password`,
                        });
                        break;
                    default:
                        res.status(400).send({
                            error: 'invalid registration information',
                        });
                }
            });
    },
    login(req, res, next) {
        const schema = Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string()
                .required()
                .regex(new RegExp('^[a-zA-Zа-яА-ЯёЁ0-9]{8,32}$')),
        });
        schema
            .validateAsync(req.body)
            .then(() => {
                next();
            })
            .catch((err) => {
                switch (err.details[0].context.key) {
                    case 'email':
                        res.status(400).send({
                            error: 'You must provide a valid email address',
                        });
                        break;
                    case 'password':
                        res.status(400).send({
                            error: `The password match was failed`,
                        });
                        break;
                    default:
                        res.status(400).send({
                            error: 'invalid login information',
                        });
                }
            });
    },
};
