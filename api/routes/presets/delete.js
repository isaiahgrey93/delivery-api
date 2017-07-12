const Joi = require("joi");

module.exports = {
    path: "/api/presets/{preset_id}",
    method: "DELETE",
    config: {
        validate: {
            params: {
                preset_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let id = request.params.preset_id;

            let preset = await this.libs.presets.delete(id);

            if (preset.error) {
                return reply(preset.error);
            }

            preset = preset.result;

            preset = this.helpers.toClientEntity.Preset(preset);

            reply(preset);
        }
    }
};
