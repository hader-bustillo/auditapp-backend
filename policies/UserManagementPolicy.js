const Joi = require('joi');

module.exports = {
    getUsersList(req, res, next) {
        const schema = Joi.object({
            page: Joi.number(),
            limit: Joi.number().max(100),
            filter: Joi.string().allow(''),
        });
        schema
            .validateAsync(req.query)
            .then(() => {
                next();
            })
            .catch(({ details }) => {
                const message = details.map((i) => i.message).join(',');
                res.status(422).json({ error: message });
            });
    },
};
