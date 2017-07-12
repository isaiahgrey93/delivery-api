const Joi = require("joi");

module.exports = {
    path: "/api/drives/{drive_id}/charge",
    method: "POST",
    config: {
        validate: {
            payload: {
                source: Joi.any().required(),
                customer: Joi.any().required()
            },
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
            let { source, customer } = request.payload;

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let drive = await resolve(
                this.libs.drives.charge(driveId, source, customer, {
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
