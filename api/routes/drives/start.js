const Joi = require("joi");

module.exports = {
    path: "/api/drives/{drive_id}/start",
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

            let params = this.helpers.toServerEntity.Drive(data);

            let drive = await resolve(
                this.libs.drives.start(driveId, {
                    populate: relations
                })
            );

            if (drive.error) {
                return reply(drive.error);
            }

            drive = drive.result;

            drive = this.helpers.toClientEntity.Drive(drive);

            reply(drive);
        }
    }
};
