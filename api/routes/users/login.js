const Joi = require("joi");
const Boom = require("boom");

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
                let token = this.utils.user.grantJSONWebToken(user);

                user.token = token;
                return reply(user);
            } catch (e) {
                return reply(e);
            }
        }
    }
};
