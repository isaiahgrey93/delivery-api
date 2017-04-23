const Joi = require("joi");
const Boom = require("boom");

module.exports = {
    path: "/api/drives/{drive_id}/refund",
    method: "POST",
    config: {
        auth: {
            scope: ["admin"]
        },
        validate: {
            params: {
                drive_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let id = request.params.drive_id;

            this.core
                .model("Drive")
                .findById(id, {
                    populate: {
                        requester: true,
                        driver: true
                    }
                })
                .then(drive => this.core.stripe.refunds.create(drive))
                .then(transfers => {
                    return this.core.model("Drive").update({
                        id: id,
                        status: "refunded"
                    });
                })
                .then(refund => reply(refund))
                .catch(err => reply(err));
        }
    }
};
