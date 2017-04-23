const Joi = require("joi");
const Boom = require("boom");

module.exports = {
    path: "/api/drives/{drive_id}/process",
    method: "POST",
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
                    populate: {
                        requester: true,
                        driver: true
                    }
                })
                .then(drive => this.core.stripe.transfers.create(drive))
                .then(transfers => {
                    let ids = [];

                    if (!transfers.length) return Boom.badRequest(transfers);

                    transfers.map(transfer => ids.push(transfer.id));

                    return this.core.model("Drive").update({
                        id: id,
                        status: "delivered",
                        payment: {
                            transfer_ids: ids
                        }
                    });
                })
                // .then((drive) => this.core.support.extensions.releaseExtensions(drive))
                .then(drive => {
                    return this.core.model("Drive").findById(drive.id, {
                        populate: this.utils.model.populate(relations)
                    });
                })
                .then(drive => reply(drive))
                .catch(err => reply(err));
        }
    }
};
