const Joi = require("joi");

module.exports = {
    path: "/api/vehicles",
    method: "POST",
    config: {
        validate: {
            payload: {
                nickname: Joi.string(),
                make: Joi.string().required(),
                model: Joi.string().required(),
                year: Joi.string().required(),
                license_plate: Joi.object()
                    .keys({
                        number: Joi.string(),
                        state: Joi.string()
                    })
                    .required(),
                insurance: Joi.any(),
                registration: Joi.any(),
                images: Joi.array().items(Joi.any()).max(4).single(),
                user_id: Joi.string(),
                truck_id: Joi.string()
            }
        },
        tags: ["api"],
        handler: async function(request, reply) {
            let data = request.payload;
            data.user_id = request.payload.user_id
                ? request.payload.user_id
                : request.auth.credentials.id;

            let params = this.helpers.toServerEntity.Vehicle(data);

            let vehicle = await resolve(this.libs.vehicles.create(params));

            if (vehicle.error) {
                return reply(vehicle.error);
            }

            vehicle = vehicle.result;

            vehicle = this.helpers.toClientEntity.Vehicle(vehicle);

            reply(vehicle);
        }
    }
};
