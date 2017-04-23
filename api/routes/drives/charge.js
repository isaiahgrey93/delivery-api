const Joi = require("joi");
const Boom = require("boom");

module.exports = {
    path: "/api/drives/{drive_id}/charge",
    method: "POST",
    config: {
        validate: {
            payload: {
                source: Joi.any().required()
            },
            params: {
                drive_id: Joi.string().required()
            }
        },
        tags: ["api"],
        handler: function(request, reply) {
            let id = request.params.drive_id;
            let source = request.payload.source;

            this.core
                .model("Drive")
                .findById(id, {
                    populate: {
                        requester: true,
                        driver: true
                    }
                })
                .then(drive => this.core.stripe.charges.create(drive, source))
                .then(charge => {
                    if (!charge.paid)
                        return Boom.badRequest(
                            `<Unable to process payment for drive <${id}>.`
                        );

                    let drive = {
                        id: id,
                        status: "available",
                        payment: {
                            driver_payout: this.utils.stripe.getPayout(
                                "driver",
                                charge.amount
                            ),
                            joey_payout: this.utils.stripe.getPayout(
                                "joey",
                                charge.amount
                            ),
                            charge_id: charge.id
                        }
                    };

                    return this.core.model("Drive").update(drive);
                })
                .then(drive => reply(drive))
                .catch(err => reply(err));
        }
    }
};
