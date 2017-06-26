const Joi = require("joi");
const { toClientEntity, toServerEntity } = require("./helpers");

module.exports = {
    path: "/api/drives/{drive_id}/accept",
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
            let driverId = drive.driver_id || request.auth.credentials.id;

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let params = toServerEntity(data);

            let drive = await resolve(
                this.libs.drives.accept(driveId, driverId, {
                    populate: relations
                })
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
