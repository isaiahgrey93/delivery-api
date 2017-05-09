const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

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

            try {
                let preset = await this.libs.presets.delete(id);

                preset = toClientEntity(preset);

                reply(preset);
            } catch (e) {
                reply(e);
            }
        }
    }
};
