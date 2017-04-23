const Joi = require("joi");
const Boom = require("boom");

module.exports = {
    path: "/api/drives/{user_id}/user",
    method: "GET",
    config: {
        validate: {
            params: {
                user_id: Joi.string().required()
            },
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let relations = request.query.populate;
            let user = request.params.user_id;

            this.core.drive
                .getByUser(user, {
                    populate: this.utils.model.populate(relations)
                })
                .then(drive => reply(drive))
                .catch(err => reply(err));
        }
    }
};
