const Joi = require("joi");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/categories",
    method: "GET",
    config: {
        tags: ["api"],
        validate: {
            query: {
                populate: Joi.string().optional()
            }
        },
        handler: async function(request, reply) {
            let { populate = "" } = request.query;
            let relations = populate.split(",");

            try {
                let categories = await this.libs.categories.getAll({
                    populate: relations
                });

                categories = categories.map(c => toClientEntity(c));

                reply(categories);
            } catch (e) {
                reply(e);
            }
        }
    }
};
