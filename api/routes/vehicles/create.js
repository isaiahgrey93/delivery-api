const Joi = require("joi");
const Prehandlers = require("../../../old-lib/prehandlers");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/vehicles",
    method: "POST",
    config: {
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
        handler: async function(request, reply) {
            let data = request.payload;
            data.user_id = request.payload.user_id
                ? request.payload.user_id
                : request.auth.credentials.id;

            let params = toServerEntity(data);
            try {
                let vehicle = await this.libs.vehicles.create(params);

                vehicle = toClientEntity(vehicle);
                reply(vehicle);
            } catch (e) {
                reply(e);
            }
        }
    }
};
