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
            let relations = request.query.populate;

            try {
                let categories = await this.libs.categories.getAll();

                categories = categories.map(c => toClientEntity(c));

                reply(categories);
            } catch (e) {
                reply(e);
            }
        }
    }
};
