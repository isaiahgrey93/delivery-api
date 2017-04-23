const Joi = require("joi");
const Boom = require("boom");

module.exports = {
    path: "/api/drives/{drive_id}/accept",
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
            let drive = request.payload || {};
            let relations = request.query.populate;
            let driver_id = drive.driver_id || request.auth.credentials.id;

            this.core
                .model("Drive")
                .findById(id)
                .then(drive => {
                    if (drive.driver_id !== "N/A")
                        throw Boom.badRequest("Drive is no longer available.");

                    try {
                        this.core.support.sms.send(
                            drive.customer.phone,
                            "Your delivery has been accepted by a JOEY driver. The driver will be calling you soon to coordinate your delivery."
                        );
                    } catch (e) {
                        console.log(e);
                    }

                    return this.core
                        .model("Drive")
                        .update({ id, driver_id, status: "accepted" });
                })
                .then(res => {
                    if (res.isBoom) return res;

                    return this.core.model("Drive").findById(res.id, {
                        populate: this.utils.model.populate(relations)
                    });
                })
                .then(res => reply(res))
                .catch(err => reply(err));
        }
    }
};
