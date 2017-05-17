const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/categories/{category_id}",
    method: "GET",
    config: {
        validate: {
            params: {
                category_id: Joi.string().required()
            },
            query: {
                populate: Joi.string().optional()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let id = request.params.category_id;

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let category = await resolve(
                this.libs.categories.getById(id, {
                    populate: relations
                })
            );

            if (category.error) {
                return reply(category.error);
            }

            category = category.result;

            category = toClientEntity(category);

            reply(category);
        }
    }
};
