'use strict';

const Joi = require('joi');
const Prehandlers = require('../prehandlers');

const VehicleSchema = {
    nickname: Joi.string().description('Vehicle nickname.').example('Tom\'s truck.'),
    make: Joi.string().description('Vehicle make').example('Ford'),
    model: Joi.string().description('Vehicle model').example('F150'),
    year: Joi.string().description('Vehicle year').example('2007'),
    license_plate: Joi.object().keys({
        number: Joi.string().description('Vehicle license plate number').example('7B 7J006R'),
        state: Joi.string().description('Vehicle license plate state').example('ID'),
    }),
    insurance: Joi.any().description('Image of proof of insurance').example('[UUID]'),
    registration:Joi.any().description('Image of proof of registration').example('[UUID]'),
    images: Joi.array().items(
        Joi.any().description('Image of the vehicle').example('[UUID]')
    ).max(4).single(),
    user_id: Joi.string().description('Unique id of the user who vehicle belongs').example('[UUID]'),
}

const VehiclePrehandlers = [
  {
    assign: 'insurance',
    method: Prehandlers.upload('insurance'),
  },
  {
    assign: 'registration',
    method: Prehandlers.upload('registration'),
  },
  {
    assign: 'images[0]',
    method: Prehandlers.upload('images[0]'),
  },
  {
    assign: 'images[1]',
    method: Prehandlers.upload('images[1]'),
  },
  {
    assign: 'images[2]',
    method: Prehandlers.upload('images[2]'),
  },
  {
    assign: 'images[3]',
    method: Prehandlers.upload('images[3]'),
  },
]

module.exports.create = {
    auth: {
        scope: ['driver', 'admin']
    },
    validate: {
        payload: VehicleSchema
    },
    tags: ['api'],
    pre: VehiclePrehandlers,
    handler: function(request, reply) {
        let vehicle = new this.db.models.Vehicle(request.payload);
        if (request.auth.credentials.scope[0] !== 'admin') vehicle.user_id = request.auth.credentials.id;

        this.utils.model.validate(vehicle);

        this.core.model('Vehicle').create(vehicle)
        .then((vehicle) => reply(vehicle))
        .catch((err) => reply(err))
    }
}


module.exports.update = {
    plugins: {
        policies: ['isAdminOrOwner']
    },
    validate: {
        payload: VehicleSchema,
        params: {
            vehicle_id: Joi.string().required().description('The unique id of the vehcile to update')
        }
    },
    tags: ['api'],
    pre: VehiclePrehandlers,
    handler: function(request, reply) {
        let vehicle = new this.db.models.Vehicle(request.payload);
        vehicle.id = request.params.vehicle_id;

        this.utils.model.validate(vehicle);

        this.core.model('Vehicle').update(vehicle)
        .then((vehicle) => reply(vehicle))
        .catch((err) => reply(err))
    }
}

module.exports.remove = {
    auth: {
        scope: ['driver', 'admin']
    },
    plugins : {
        policies: ['isAdminOrOwner']
    },
    validate: {
        params: {
            vehicle_id: Joi.string().required().description('The unique id of the vehcile to remove')
        }
    },
    tags: ['api'],
    handler: function(request, reply) {
        let id = request.params.vehicle_id;

        this.core.model('Vehicle').remove(id)
        .then((res) => reply(res))
        .catch((err) => reply(err));
    }
}

module.exports.getById = {
    plugins: {
        policies: ['isAdminOrOwner']
    },
    validate: {
        params: {
            vehicle_id: Joi.string().required().description('The unique id of the vehcile to fetch')
        }
    },
    handler: function(request, reply) {
        let id = request.params.vehicle_id;

        this.core.model('Vehicle').findById(id)
        .then((vehicle) => reply(vehicle))
        .catch((err) => reply(err));
    }
}

module.exports.getAll = {
    plugins: {
        policies: ['isAdminOrOwner']
    },
    tags: ['api'],
    handler: function(request, reply) {

        this.core.model('Vehicle').getAll()
        .then((vehicle) => reply(vehicle))
        .catch((err) => reply(err));
    }
}
