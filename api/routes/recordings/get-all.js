const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/recordings",
    method: "GET",
    config: {
        tags: ["api"],
        handler: async function(request, reply) {
            try {
                let recordings = await this.libs.recordings.getAll();

                recordings = recordings.map(r => toClientEntity(r));

                reply(recordings);
            } catch (e) {
                reply(e);
            }
        }
    }
};
