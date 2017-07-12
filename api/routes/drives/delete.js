const Joi = require("joi");

module.exports = {
    path: "/api/drives/{drive_id}",
    method: "DELETE",
    config: {
        plugins: {
            policies: ["isAdminOrOwner"]
        },
        validate: {
            params: {
                drive_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let id = request.params.drive_id;

            let drive = await resolve(this.libs.drives.delete(id));

            if (drive.error) {
                return reply(drive.error);
            }

            drive = drive.result;

            drive = this.helpers.toClientEntity.Drive(drive);

            reply(drive);
        }
    }
};
