const Joi = require("joi");
const { toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/users",
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
                let users = await this.libs.users.getAll({
                    populate: relations
                });

                users = users.map(u => toClientEntity(u));

                reply(users);
            } catch (e) {
                reply(e);
            }
        }
    }
};
