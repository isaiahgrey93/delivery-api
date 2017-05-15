const Joi = require("joi");
const { toClientEntity } = require("./helpers");

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

            try {
                let user = await this.libs.users.getById(id, {
                    populate: relations
                });

                user = toClientEntity(user);

                reply(user);
            } catch (e) {
                reply(e);
            }
        }
    }
};
