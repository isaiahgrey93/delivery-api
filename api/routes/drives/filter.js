const Joi = require("joi");
const { toClientEntity, toServerEntity } = require("./helpers");

// TODO(isaiah) add geo queries to filter endpoint
// // // geometry: Joi.array(),
// // // distance: Joi.number().positive()

module.exports = {
    path: "/api/drives/filter",
    method: "POST",
    config: {
        validate: {
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let data = request.payload;
            let query = toServerEntity(data);

            let { populate = "" } = request.query;
            let relations = populate.split(",");

            let drives = await resolve(
                this.libs.drives.filterBy(query, {
                    populate: relations
                })
            );

            if (drives.error) {
                return reply(drive.error);
            }

            drives = drives.result;

            drives = drives.map(d => toClientEntity(d));

            reply(drives);
        }
    }
};
