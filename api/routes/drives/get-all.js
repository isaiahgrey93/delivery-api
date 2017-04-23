const Joi = require("joi");
const Boom = require("boom");

module.exports = {
    path: "/api/drives",
    method: "GET",
    config: {
        validate: {
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let relations = request.query.populate;

            this.core
                .model("Drive")
                .getAll({
                    populate: this.utils.model.populate(relations)
                })
                .then(drive => reply(drive))
                .catch(err => reply(err));
        }
    }
};
