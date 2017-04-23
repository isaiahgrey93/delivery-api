const Joi = require("joi");

module.exports = {
    path: "/api/users/filter",
    method: "POST",
    config: {
        validate: {
            query: {
                populate: Joi.string(),
                geometry: Joi.array(),
                distance: Joi.number().positive()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let relations = request.query.populate;
            let geometry = request.query.geometry || [];
            let distance = request.query.distance || 50;
            let query = request.payload;

            this.core.user
                .query(query, {
                    populate: this.utils.model.populate(relations),
                    geometry: this.utils.drive.getGeometry(geometry, distance)
                })
                .then(users => reply(users))
                .catch(err => reply(err));
        }
    }
};
