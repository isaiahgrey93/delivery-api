const Joi = require("joi");

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

            let params = this.helpers.toServerEntity.Preset(data);

            let preset = await resolve(this.libs.presets.create(params));

            if (preset.error) {
                return reply(preset.error);
            }

            preset = preset.result;

            preset = this.helpers.toClientEntity.Preset(preset);

            reply(preset);
        }
    }
};
