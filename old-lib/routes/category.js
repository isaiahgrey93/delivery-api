"use strict";

const Joi = require("joi");
const Prehandlers = require("../prehandlers");

const CategorySchema = {
    name: Joi.string()
        .description("The title name of the category.")
        .example("Furniture"),
    description: Joi.string()
        .description("A short description of items types in this category.")
        .example("Beds, Couches, Chairs"),
    image: Joi.any()
        .description("An image encompassing the category.")
        .example("[UUID] or [Binary Representation in FD Request]"),
    user_id: Joi.string()
        .description("The unique _id of the kiosk to add the category for.")
        .example("[UUID] of Kiosk user.")
};

const CategoryPrehandlers = [
    {
        assign: "image",
        method: Prehandlers.upload("image")
    }
];

module.exports.create = {
    tags: ["api"],
    auth: {
        scope: ["requester", "admin"]
    },
    validate: {
        payload: CategorySchema
    },
    pre: CategoryPrehandlers,
    handler: function(request, reply) {
        let category = new this.db.models.Category(request.payload);
        category.user_id = category.user_id !== undefined
            ? category.user_id
            : request.auth.credentials.id;

        this.utils.model.validate(category);

        this.core
            .model("Category")
            .create(category)
            .then(category => reply(category))
            .catch(err => reply(err));
    }
};

module.exports.update = {
    tags: ["api"],
    auth: {
        scope: ["requester", "admin"]
    },
    // plugins : {
    //     policies: ['isAdminOrOwner']
    // },
    validate: {
        payload: CategorySchema,
        params: {
            category_id: Joi.string()
                .required()
                .description("The unique id of the category to update.")
                .example("[UUID]")
        }
    },
    pre: CategoryPrehandlers,
    handler: function(request, reply) {
        let category = new this.db.models.Category(request.payload);
        category.id = request.params.category_id;

        this.utils.model.validate(category);

        this.core
            .model("Category")
            .update(category)
            .then(category => reply(category))
            .catch(err => reply(err));
    }
};

module.exports.remove = {
    auth: {
        scope: ["requester", "admin"]
    },
    // plugins : {
    //     policies: ['isAdminOrOwner']
    // },
    validate: {
        params: {
            category_id: Joi.string()
                .required()
                .description("The unique id of the category to remove.")
                .example("[UUID]")
        }
    },
    tags: ["api"],
    handler: function(request, reply) {
        let id = request.params.category_id;

        this.core
            .model("Category")
            .remove(id)
            .then(res => reply(res))
            .catch(err => reply(err));
    }
};

module.exports.getById = {
    // plugins: {
    //     policies: ['isAdminOrOwner']
    // },
    validate: {
        params: {
            category_id: Joi.string()
                .required()
                .description("The unique id of the category to fetch.")
                .example("[UUID]")
        }
    },
    tags: ["api"],
    handler: function(request, reply) {
        let id = request.params.category_id;
        let relations = request.query.populate;

        this.core
            .model("Category")
            .findById(id, {
                populate: this.utils.model.populate(relations)
            })
            .then(category => reply(category))
            .catch(err => reply(err));
    }
};

module.exports.getAll = {
    // plugins: {
    //     policies: ['isAdminOrOwner']
    // },
    tags: ["api"],
    validate: {
        query: {
            populate: Joi.string()
                .optional()
                .description(
                    'Option to populate category relationships. Options: ["presets"]'
                )
                .example("?populate=presets")
        }
    },
    handler: function(request, reply) {
        let relations = request.query.populate;

        this.core
            .model("Category")
            .getAll({
                populate: this.utils.model.populate(relations)
            })
            .then(category => reply(category))
            .catch(err => reply(err));
    }
};
