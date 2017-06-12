const sanitize = require("./sanitize");

module.exports = data => {
    let { price = {} } = data;

    return sanitize({
        id: data.id,
        price: {
            base: price.base,
            mile: price.mile
        },
        length: data.length,
        width: data.width,
        height: data.height,
        type: data.type,
        image: data.image,
        name: data.name
    });
};
