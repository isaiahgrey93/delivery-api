const Joi = require("joi");
const Boom = require("boom");

module.exports = {
    path: "/api/drives/{drive_id}",
    method: "GET",
    config: {
        validate: {
            params: {
                drive_id: Joi.string().required()
            },
            query: {
                populate: Joi.string()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let id = request.params.drive_id;
            let relations = request.query.populate;

            this.core
                .model("Drive")
                .findById(id, {
                    populate: this.utils.model.populate(relations)
                })
                .then(drive => reply(drive))
                .catch(err => reply(err));
        }
    }
};
