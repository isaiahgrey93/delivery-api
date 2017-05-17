const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/categories",
    method: "GET",
    config: {
        tags: ["api"],
        validate: {
            query: {
                populate: Joi.string().optional()
            }
        },
        handler: async function(request, reply) {
            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let categories = await resolve(
                this.libs.categories.getAll({
                    populate: relations
                })
            );

            if (categories.error) {
                return reply(categories.error);
            }

            categories = categories.result;

            categories = categories.map(c => toClientEntity(c));

            reply(categories);
        }
    }
};
