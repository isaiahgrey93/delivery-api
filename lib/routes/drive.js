'use strict';

const Joi = require('joi');
const DriveSchema = {
  requester_id: Joi.string().description('Requester unique id.'),
  driver_id: Joi.string().description('Drive unique id.'),
  status: Joi.string().valid('new', 'available', 'active', 'delivered', 'processed', 'refunded').description('Drive status.'),
  price: Joi.number().positive().description('Drive price in cents'),
  payment: Joi.object().keys({
    charge_id: Joi.string().description('Charge unique id from Stripe.'),
    transfer_ids: Joi.array().items(Joi.string()).description('Transfer(s) unique id(s) from Stripe.')
  }),
  route: Joi.object().keys({
    origin: Joi.object().keys({
      street: Joi.string().description('Address street.'),
      city: Joi.string().description('Address city.'),
      state: Joi.string().description('Address state.'),
      country: Joi.string().description('Address country.'),
      postal_code: Joi.string().description('Address postal code.')
    }).description('Origin Address.'),
    destination: Joi.object().keys({
      street: Joi.string().description('Address street.'),
      city: Joi.string().description('Address city.'),
      state: Joi.string().description('Address state.'),
      country: Joi.string().description('Address country.'),
      postal_code: Joi.string().description('Address postal code.')
    }).description('Destination Address.'),
  }).description('Route origin & destination addresses.'),
  items: Joi.array().items(
    Joi.object().keys({
      name: Joi.string().description('Item name.'),
      height: Joi.number().description('Item height.'),
      width: Joi.number().description('Item width.'),
      depth: Joi.number().description('Item depth.'),
      weight: Joi.number().description('Item weight.'),
      images: Joi.array().items(Joi.string()).description('Item image list.')
    }).description('An item in the drive')
  ).description('Collection of items in the drive.'),
  support: Joi.object().keys({
    driver_ext: Joi.string().description('Driver extension.'),
    requester_ext: Joi.string().description('Requester extension.')
  }).description('Support call numbers for drive.')
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

    this.core.geo.getCoordinates(drive)
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
      drive_id: Joi.string().required().description('Drive unique id.')
    }
  },
  tags: ['api'],
  handler: function(request, reply) {
    let drive = request.payload;
    drive.id = request.params.drive_id;

    this.core.geo.getCoordinates(drive)
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
      drive_id: Joi.string().required().description('Drive unique id.')
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
      drive_id: Joi.string().required().description('Drive unique id.')
    },
    query: {
      populate: Joi.string().description('Relation(s) to populate.').example('?populate=requester,driver')
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
      populate: Joi.string().description('Relation(s) to populate.').example('?populate=requester,driver')
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
      drive_id: Joi.string().required().description('Drive unique id.')
    }
  },
  tags: ['api'],
  handler: function (request, reply) {
    reply('Trip Estimate')
  }
}

module.exports.charge = {
  validate: {
    payload: {
      source: Joi.any().required().description('Card/Bank object, or Stripe.js token.')
    },
    params: {
      drive_id: Joi.string().required().description('Drive unique id.')
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
      drive_id: Joi.string().required().description('Drive unique id.')
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
      drive_id: Joi.string().required().description('Drive unique id.')
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
