const Joi = require("joi");
const { toClientEntity, toServerEntity } = require("./helpers");

module.exports = {
    path: "/api/drives/filter",
    method: "POST",
    config: {
        validate: {
            query: {
                geometry: Joi.array(),
                populate: Joi.string(),
                distance: Joi.number().positive()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let data = request.payload;
            let query = toServerEntity(data);

            let { populate = "", geometry, distance } = request.query;
            let relations = populate.split(",");

            let drives = await resolve(
                this.libs.drives.filterBy(
                    query,
                    {
                        populate: relations
                    },
                    {
                        distance: distance,
                        coordinates: geometry
                    }
                )
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
