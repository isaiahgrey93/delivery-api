const Joi = require("joi");
const Boom = require("boom");
const { toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/users/login",
    method: "POST",
    config: {
        auth: false,
        validate: {
            query: {
                populate: Joi.string()
            },
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().min(6).required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let credentials = request.payload;
            let relations = request.query.populate;

            try {
                let user = await this.libs.users.authenticate(credentials);
                user = toClientEntity(user);

                user.token = this.utils.user.grantJSONWebToken(user);
                return reply(user);
            } catch (e) {
                return reply(e);
            }
        }
    }
};
