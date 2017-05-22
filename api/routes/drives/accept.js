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
            let id = request.params.drive_id;
            let data = request.payload || {};
            let driver_id = drive.driver_id || request.auth.credentials.id;

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let params = toServerEntity(data);

            let drive = await resolve(
                this.libs.drives.accept(params, driver_id, {
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
