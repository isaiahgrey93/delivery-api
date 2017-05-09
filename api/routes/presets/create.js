const Joi = require("joi");
const Prehandlers = require("../../../old-lib/prehandlers");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/presets",
    method: "POST",
    config: {
        validate: {
            payload: {
                name: Joi.string(),
                width: Joi.string(),
                height: Joi.string(),
                length: Joi.string(),
                weight: Joi.string(),
                image: Joi.any(),
                category_id: Joi.string().required()
            }
        },
        tags: ["api"],
        pre: [
            {
                assign: "image",
                method: Prehandlers.upload("image")
            }
        ],
        handler: async function(request, reply) {
            let data = request.payload;

            let params = toServerEntity(data);

            try {
                let preset = await this.libs.presets.create(params);

                preset = toClientEntity(preset);

                reply(preset);
            } catch (e) {
                reply(e);
            }
        }
    }
};
