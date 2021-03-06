const Joi = require("joi");

module.exports = {
    path: "/api/categories/{category_id}",
    method: "DELETE",
    config: {
        validate: {
            params: {
                category_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let id = request.params.category_id;

            let category = await resolve(this.libs.categories.delete(id));

            if (category.error) {
                return reply(category.error);
            }

            category = category.result;

            category = this.helpers.toClientEntity.Category(category);

            reply(category);
        }
    }
};
