'use strict';

const Joi = require('joi');
const DriveSchema = {
    requester_id: Joi.string(),
    driver_id: Joi.string(),
    status: Joi.string().valid('new', 'available', 'active', 'delivered', 'processed', 'refunded'),
    start_time: Joi.date(),
    end_time: Joi.date(),
    price: Joi.number().positive(),
    payment: Joi.object().keys({
        charge_id: Joi.string(),
        transfer_ids: Joi.array().items(Joi.string()),
    }),
    route: Joi.object().keys({
        origin: Joi.object().keys({
            street: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            country: Joi.string(),
            postal_code: Joi.string()
        }),
        destination: Joi.object().keys({
            street: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            country: Joi.string(),
            postal_code: Joi.string()
        }),
    }),
    items: Joi.array().items(
        Joi.object().keys({
            name: Joi.string(),
            quantity: Joi.number(),
            height: Joi.number(),
            width: Joi.number(),
            length: Joi.number(),
            weight: Joi.number(),
            value: Joi.number(),
            images: Joi.array().items(Joi.string())
        })
    ),
    support: Joi.object().keys({
        driver_ext: Joi.string(),
        requester_ext: Joi.string()
    })
}

module.exports.create = {
    auth: {
        scope: ['requester', 'admin']
    },
    validate: {
        payload: DriveSchema
    },
    tags: ['api'],
    handler: function(request, reply) {
        let drive = request.payload;
        drive.requester_id = drive.requester_id || request.auth.credentials.id;

        this.core.drive.getGeoPoints(drive)
        .then((drive) => {
            drive = new this.db.models.Drive(drive);

            this.utils.model.validate(drive);

            this.core.model('Drive').create(drive)
            .then((drive) => reply(drive))
        })
        .catch((err) => reply(err));
    }
}

module.exports.update = {
    validate: {
        payload: DriveSchema,
        params: {
            drive_id: Joi.string().required()
        }
    },
    tags: ['api'],
    handler: function(request, reply) {
        let drive = request.payload;
        drive.id = request.params.drive_id;

        this.core.drive.getGeoPoints(drive)
        .then((drive) => {
            drive = new this.db.models.Drive(drive);

            this.utils.model.validate(drive);

            this.core.model('Drive').update(drive)
            .then((drive) => reply(drive))
        })
        .catch((err) => reply(err));
    }
}

module.exports.remove = {
    plugins : {
        policies: ['isAdminOrOwner']
    },
    validate: {
        params: {
            drive_id: Joi.string().required()
        }
    },
    tags: ['api'],
    handler: function(request, reply) {
        let id = request.params.drive_id;

        this.core.model('Drive').remove(id)
        .then((res) => reply(res))
        .catch((err) => reply(err));
    }
}

module.exports.getById = {
    validate: {
        params: {
            drive_id: Joi.string().required()
        },
        query: {
            populate: Joi.string()
        }
    },
    tags: ['api'],
    handler: function(request, reply) {
        let id = request.params.drive_id;
        let relations = request.query.populate;

        this.core.model('Drive').findById(id, {
            populate: this.utils.model.populate(relations)
        })
        .then((drive) => reply(drive))
        .catch((err) => reply(err));
    }
}

module.exports.getAll = {
    plugins : {
        policies: ['isAdminOrOwner']
    },
    validate: {
        query: {
            populate: Joi.string()
        }
    },
    tags: ['api'],
    handler: function(request, reply) {
        let relations = request.query.populate;

        this.core.model('Drive').getAll({
            populate: this.utils.model.populate(relations)
        })
        .then((drive) => reply(drive))
        .catch((err) => reply(err));
    }
}

module.exports.estimate = {
    validate: {
        params: {
            drive_id: Joi.string().required()
        }
    },
    tags: ['api'],
    handler: function (request, reply) {
        let id = request.params.drive_id;
        let relations = request.query.populate;

        this.core.model('Drive').findById(id, {
            populate: this.utils.model.populate(relations)
        })
        .then((drive) => this.core.drive.getTripDistance(drive))
        .then((data) => this.core.drive.getEstimate(data))
        .then((estimate) => reply(estimate))
        .catch((err) => {
            reply(err)
        });
    }
}

module.exports.accept = {
    validate: {
        params: {
            drive_id: Joi.string().required()
        }
    },
    tags: ['api'],
    handler: function (request, reply) {
        let id = request.params.drive_id;
        let drive = request.payload || {};
        let driver_id = drive.driver_id || request.auth.credentials.id;

        console.log({id, driver_id})

        this.core.model('Drive').update({ id, driver_id, })
        .then((drive) => reply(drive))
        .catch((err) => reply(err));
    }
}

module.exports.charge = {
    validate: {
        payload: {
            source: Joi.any().required()
        },
        params: {
            drive_id: Joi.string().required()
        }
    },
    tags: ['api'],
    handler: function (request, reply) {
        let id = request.params.drive_id;
        let source = request.payload.source;

        this.core.model('Drive').findById(id,  {
            populate: {
                requester: true,
                driver: true
            }
        })
        .then((drive) => this.core.stripe.charges.create(drive, source))
        .then((charge) => {
            let drive = {
                id: id,
                status: 'available',
                payment: {
                    charge_id: charge.id,
                }
            }

            return this.core.model('Drive').update(drive)
        })
        .then((drive) => reply(drive))
        .catch((err) => reply(err));
    }
}

module.exports.process = {
    validate: {
        params: {
            drive_id: Joi.string().required()
        }
    },
    tags: ['api'],
    handler: function (request, reply) {
        let id = request.params.drive_id;

        this.core.model('Drive').findById(id,  {
            populate: {
                requester: true,
                driver: true
            }
        })
        .then((drive) => this.core.stripe.transfers.create(drive))
        .then((transfers) => {
            let ids = [];
            transfers.map((transfer) => ids.push(transfer.id))

            return this.core.model('Drive').update({
                id: id,
                status: 'processed',
                payment: {
                    transfer_ids: ids
                }
            })
        })
        .then((drive) => reply(drive))
        .catch((err) => reply(err));
    }
}

module.exports.refund = {
    auth: {
        scope: ['admin']
    },
    validate: {
        params: {
            drive_id: Joi.string().required()
        }
    },
    tags: ['api'],
    handler: function (request, reply) {
        let id = request.params.drive_id;

        this.core.model('Drive').findById(id,  {
            populate: {
                requester: true,
                driver: true
            }
        })
        .then((drive) => this.core.stripe.refunds.create(drive))
        .then((transfers) => {
            return this.core.model('Drive').update({
                id: id,
                status: 'refunded'
            })
        })
        .then((refund) => reply(refund))
        .catch((err) => reply(err));
    }
}
