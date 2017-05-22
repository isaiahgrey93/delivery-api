const Joi = require("joi");
const { toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/drives/{drive_id}",
    method: "GET",
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

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let drive = await resolve(
                this.libs.drives.getById(id, {
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
