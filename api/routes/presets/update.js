const Joi = require("joi");

module.exports = {
    path: "/api/presets/{preset_id}",
    method: ["PUT", "PATCH"],
    config: {
        tags: ["api"],
        validate: {
            payload: {
                name: Joi.string(),
                width: Joi.string(),
                height: Joi.string(),
                length: Joi.string(),
                weight: Joi.string(),
                image: Joi.any(),
                category_id: Joi.string()
            },
            params: {
                preset_id: Joi.string().required()
            }
        },
        handler: async function(request, reply) {
            let data = request.payload;
            data.id = request.params.preset_id;

            let params = this.helpers.toServerEntity.Preset(data);

            let preset = await resolve(this.libs.presets.update(params));

            if (preset.error) {
                return reply(preset.error);
            }

            preset = preset.result;

            preset = this.helpers.toClientEntity.Preset(preset);

            reply(preset);
        }
    }
};
