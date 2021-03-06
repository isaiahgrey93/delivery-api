const Joi = require("joi");

module.exports = {
    path: "/api/categories/{category_id}",
    method: ["PUT", "PATCH"],
    config: {
        tags: ["api"],
        validate: {
            payload: {
                name: Joi.string(),
                description: Joi.string(),
                image: Joi.any(),
                user_id: Joi.string()
            },
            params: {
                category_id: Joi.string().required()
            },
            query: {
                populate: Joi.string().optional()
            }
        },
        handler: async function(request, reply) {
            let data = request.payload;
            data.id = request.params.category_id;

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let params = this.helpers.toServerEntity.Category(data);

            let category = await resolve(
                this.libs.categories.update(params, {
                    populate: relations
                })
            );

            if (category.error) {
                return reply(category.error);
            }

            category = category.result;

            category = this.helpers.toClientEntity.Category(category);

            reply(category);
        }
    }
};
