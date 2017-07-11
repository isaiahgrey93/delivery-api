const Joi = require("joi");
const { toClientEntity } = require("./helpers");
const helpers = require("../vehicles/helpers");

module.exports = {
    path: "/api/users/{user_id}",
    method: "GET",
    config: {
        validate: {
            params: {
                user_id: Joi.string().required()
            },
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let id = request.params.user_id;

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let user = await resolve(
                this.libs.users.getById(id, {
                    populate: relations
                })
            );

            if (user.error) {
                return reply(user.error);
            }

            user = user.result;
            user.vehicle = helpers.toClientEntity(user.vehicle);
            user = toClientEntity(user);

            reply(user);
        }
    }
};
