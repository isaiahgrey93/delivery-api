const Joi = require("joi");
const { toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/users/magic/{code}",
    method: "GET",
    config: {
        auth: false,
        validate: {
            params: {
                code: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let code = request.params.code;

            let user = await resolve(this.libs.users.validateMagicLink(code));

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
