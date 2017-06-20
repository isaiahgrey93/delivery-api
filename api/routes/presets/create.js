const Joi = require("joi");
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
        handler: async function(request, reply) {
            let data = request.payload;

            let params = toServerEntity(data);

            let preset = await resolve(this.libs.presets.create(params));

            if (preset.error) {
                return reply(preset.error);
            }

            preset = preset.result;

            preset = toClientEntity(preset);

            reply(preset);
        }
    }
};
