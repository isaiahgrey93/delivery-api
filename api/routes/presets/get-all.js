const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/presets",
    method: "GET",
    config: {
        tags: ["api"],
        handler: async function(request, reply) {
            let presets = await resolve(this.libs.presets.getAll());

            if (presets.error) {
                return reply(presets.error);
            }

            presets = presets.results;

            presets = presets.map(p => toClientEntity(p));

            reply(presets);
        }
    }
};
