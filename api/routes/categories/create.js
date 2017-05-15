const Joi = require("joi");
const Prehandlers = require("../../../old-lib/prehandlers");
const { toServerEntity, toClientEntity } = require("./helpers");

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

            let params = toServerEntity(data);

            try {
                let category = await this.libs.categories.create(params);

                category = toClientEntity(category);

                reply(category);
            } catch (e) {
                reply(e);
            }
        }
    }
};
