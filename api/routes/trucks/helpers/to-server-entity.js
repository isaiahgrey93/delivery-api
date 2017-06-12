const sanitize = require("./sanitize");

module.exports = data => {
    let { price = {} } = data;

    return sanitize({
        id: data.id,
        price: {
            base: price.base,
            mile: price.mile
        },
        price: data.price,
        length: data.length,
        width: data.width,
        height: data.height,
        image: data.image,
        type: data.type,
        name: data.name
    });
};
