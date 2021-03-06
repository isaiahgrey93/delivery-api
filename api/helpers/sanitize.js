const _ = require("lodash");

function sanitize(data) {
    let keys = Object.keys(data);

    keys.forEach(key => {
        let val = data[key];

        if (val === undefined || val === null || val === {} || val === []) {
            delete data[key];
        }

        if (
            val &&
            _.isObject(val) &&
            !_.isBoolean(val) &&
            !_.isString(val) &&
            !_.isNumber(val) &&
            !_.isDate(val)
        ) {
            let result = sanitize(data[key]);

            if (Object.keys(result).length === 0) {
                delete data[key];
            }
        }
    });

    return data;
}

module.exports = sanitize;
