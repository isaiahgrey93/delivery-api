const Joi = require("joi");
const { toClientEntity } = require("./helpers");

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

            try {
                let drives = await this.libs.drives.getAll({
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
