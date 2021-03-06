const Joi = require("joi");

module.exports = {
    path: "/api/trucks/{truck_id}",
    method: ["PUT", "PATCH"],
    config: {
        tags: ["api"],
        validate: {
            payload: {
                type: Joi.string(),
                price: Joi.object().keys({
                    base: Joi.number(),
                    mile: Joi.number()
                }),
                length: Joi.number(),
                width: Joi.number(),
                height: Joi.number(),
                name: Joi.string(),
                image: Joi.any(),
                illustration: Joi.any()
            },
            params: {
                truck_id: Joi.string().required()
            }
        },
        handler: async function(request, reply) {
            let data = request.payload;
            data.id = request.params.truck_id;

            let params = this.helpers.toServerEntity.Truck(data);

            let truck = await resolve(this.libs.trucks.update(params));

            if (truck.error) {
                return reply(truck.error);
            }

            truck = truck.result;

            truck = this.helpers.toClientEntity.Truck(truck);

            reply(truck);
        }
    }
};
