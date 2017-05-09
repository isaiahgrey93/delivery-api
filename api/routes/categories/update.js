const Joi = require("joi");
const Prehandlers = require("../../../old-lib/prehandlers");
const { toServerEntity, toClientEntity } = require("./helpers");

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
            data.id = request.params.category_id;

            let params = toServerEntity(data);

            try {
                let category = await this.libs.categories.update(params);

                reply(category);
            } catch (e) {
                reply(e);
            }
        }
    }
};
