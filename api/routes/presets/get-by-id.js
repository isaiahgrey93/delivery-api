const Joi = require("joi");

module.exports = {
    path: "/api/presets/{preset_id}",
    method: "GET",
    config: {
        validate: {
            params: {
                preset_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let id = request.params.preset_id;

            let preset = await resolve(this.libs.presets.getById(id));

            if (preset.error) {
                return reply(preset.error);
            }

            preset = presets.result;

            preset = this.helpers.toClientEntity.Preset(preset);

            reply(preset);
        }
    }
};
