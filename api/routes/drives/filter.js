const Joi = require("joi");
const Boom = require("boom");

module.exports = {
    path: "/api/drives/filter",
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
            let distance = request.query.distance;
            let user = request.auth.credentials;
            let query = request.payload;

            this.core.drive
                .query(query, {
                    populate: this.utils.model.populate(relations),
                    geometry: this.utils.drive.getGeometry(
                        geometry,
                        distance,
                        user
                    )
                })
                .then(drive => reply(drive))
                .catch(err => reply(err));
        }
    }
};
