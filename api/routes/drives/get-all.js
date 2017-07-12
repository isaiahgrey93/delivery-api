const Joi = require("joi");

module.exports = {
    path: "/api/drives",
    method: "GET",
    config: {
        auth: false,
        validate: {
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let drives = await resolve(
                this.libs.drives.getAll({
                    populate: relations
                })
            );

            if (drives.error) {
                return reply(drives.error);
            }

            drives = drives.result;

            drives = drives.map(d => this.helpers.toClientEntity.Drive(d));

            reply(drives);
        }
    }
};
