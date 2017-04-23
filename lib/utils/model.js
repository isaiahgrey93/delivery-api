"use strict";

const Boom = require("boom");

module.exports = {
    validate: model => {
        try {
            model.validate();
        } catch (err) {
            throw Boom.badRequest(err.message);
        }
    },
    populate: function(options) {
        options = options ? options.split(/[, ]/g) : false;

        if (options) {
            let populate = {};
            options.forEach(key => (populate[key] = true));

            return populate;
        } else {
            return {};
        }
    }
};
