const Joi = require("joi");

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

            presets = presets.map(p => this.helpers.toClientEntity.Preset(p));

            reply(presets);
        }
    }
};
