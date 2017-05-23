const Joi = require("joi");
const { toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/drives/{drive_id}/process",
    method: "POST",
    config: {
        validate: {
            params: {
                drive_id: Joi.string().required()
            },
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let driveId = request.params.drive_id;

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let drive = await resolve(
                this.libs.drives.complete(driveId, { populate: relations })
            );

            if (drive.error) {
                return reply(drive.error);
            }

            drive = drive.result;

            drive = toClientEntity(drive);

            reply(drive);
        }
    }
};
