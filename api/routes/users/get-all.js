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
            let relations = request.query.populate;

            try {
                let users = await this.libs.users.getAll();
                users = users.map(u => toClientEntity(u));

                return reply(users);
            } catch (e) {
                return e;
            }
        }
    }
};
