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

            try {
                let drives = await this.libs.drives.filterBy(query, {
                    populate: relations
                });

                drives = drives.map(d => toClientEntity(d));

                reply(drives);
            } catch (e) {
                reply(e);
            }
        }
    }
};
