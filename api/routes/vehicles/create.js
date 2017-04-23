const Joi = require("joi");
const Prehandlers = require("../prehandlers");

module.exports = {
    path: "/api/vehicles",
    method: "POST",
    config: {
        auth: {
            scope: ["driver", "admin"]
        },
        validate: {
            payload: {
                nickname: Joi.string(),
                make: Joi.string(),
                model: Joi.string(),
                year: Joi.string(),
                license_plate: Joi.object().keys({
                    number: Joi.string(),
                    state: Joi.string()
                }),
                insurance: Joi.any(),
                registration: Joi.any(),
                images: Joi.array().items(Joi.any()).max(4).single(),
                user_id: Joi.string()
            }
        },
        tags: ["api"],
        pre: [
            {
                assign: "insurance",
                method: Prehandlers.upload("insurance")
            },
            {
                assign: "registration",
                method: Prehandlers.upload("registration")
            },
            {
                assign: "images[0]",
                method: Prehandlers.upload("images[0]")
            },
            {
                assign: "images[1]",
                method: Prehandlers.upload("images[1]")
            },
            {
                assign: "images[2]",
                method: Prehandlers.upload("images[2]")
            },
            {
                assign: "images[3]",
                method: Prehandlers.upload("images[3]")
            }
        ],
        handler: function(request, reply) {
            let vehicle = new this.db.models.Vehicle(request.payload);
            if (request.auth.credentials.scope[0] !== "admin")
                vehicle.user_id = request.auth.credentials.id;

            this.utils.model.validate(vehicle);

            this.core
                .model("Vehicle")
                .create(vehicle)
                .then(vehicle => reply(vehicle))
                .catch(err => reply(err));
        }
    }
};
