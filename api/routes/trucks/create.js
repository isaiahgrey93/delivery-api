const Joi = require("joi");
const Prehandlers = require("../../../old-lib/prehandlers");
const { toServerEntity, toClientEntity } = require("./helpers");

module.exports = {
    path: "/api/trucks",
    method: "POST",
    config: {
        validate: {
            payload: {
                price: Joi.object()
                    .keys({
                        base: Joi.number().required(),
                        mile: Joi.number().required()
                    })
                    .required(),
                type: Joi.string().required(),
                length: Joi.number().required(),
                width: Joi.number().required(),
                height: Joi.number().required(),
                name: Joi.string().required(),
                image: Joi.any().required()
            }
        },
        tags: ["api"],
        pre: [
            {
                assign: "image",
                method: Prehandlers.upload("image")
            }
        ],
        handler: async function(request, reply) {
            let data = request.payload;

            let params = toServerEntity(data);

            let truck = await resolve(this.libs.trucks.create(params));

            if (truck.error) {
                return reply(truck.error);
            }

            truck = truck.result;

            truck = toClientEntity(truck);

            reply(truck);
        }
    }
};
