const Joi = require("joi");

module.exports = {
    path: "/api/recordings",
    method: "GET",
    config: {
        tags: ["api"],
        handler: async function(request, reply) {
            let recordings = await resolve(this.libs.recordings.getAll());

            if (recordings.error) {
                return reply(recordings.error);
            }

            recordings = recordings.result;

            recordings = recordings.map(r =>
                this.helpers.toClientEntity.Recording(r)
            );

            reply(recordings);
        }
    }
};
