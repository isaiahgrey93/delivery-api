const Joi = require("joi");

module.exports = {
    path: "/api/drives/{drive_id}/estimate",
    method: "POST",
    config: {
        validate: {
            params: {
                drive_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let driveId = request.params.drive_id;

            let estimate = await resolve(this.libs.drives.estimate(driveId));

            if (estimate.error) {
                return reply(estimate.error);
            }

            estimate = estimate.result;

            reply(estimate);
        }
    }
};
