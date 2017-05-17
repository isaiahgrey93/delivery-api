const Joi = require("joi");
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

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let user = await resolve(
                this.libs.users.authenticate(credentials, {
                    populate: relations
                })
            );

            if (user.error) {
                return reply(user.error);
            }

            user = user.result;

            user = toClientEntity(user);
            user.token = this.utils.user.grantJSONWebToken(user);

            reply(user);
        }
    }
};
