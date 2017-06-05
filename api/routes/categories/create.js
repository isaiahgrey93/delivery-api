const Joi = require("joi");
const Prehandlers = require("../../../old-lib/prehandlers");

module.exports = {
    path: "/api/categories",
    method: "POST",
    config: {
        tags: ["api"],
        validate: {
            payload: {
                name: Joi.string(),
                description: Joi.string(),
                image: Joi.any(),
                user_id: Joi.string()
            }
        },
        pre: [
            {
                assign: "image",
                method: Prehandlers.upload("image")
            }
        ],
        handler: async function(request, reply) {
            let data = request.payload;
            let auth = request.auth.credentials;

            data.user_id = data.user_id ? data.user_id : auth.id;

            let params = this.helpers.toServerEntity.Category(data);

            let category = await resolve(this.libs.categories.create(params));

            if (category.error) {
                return reply(category.error);
            }

            category = category.result;

            category = this.helpers.toClientEntity.Category(category);

            reply(category);
        }
    }
};
