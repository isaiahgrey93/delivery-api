const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/presets",
    method: "GET",
    config: {
        tags: ["api"],
        handler: async function(request, reply) {
            try {
                let presets = await this.libs.presets.getAll();
                presets = presets.map(p => toClientEntity(p));

                reply(presets);
            } catch (e) {
                reply(e);
            }
        }
    }
};
