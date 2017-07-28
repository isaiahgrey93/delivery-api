const sanitize = require("./helpers/sanitize");

function Truck(truck) {
    const { id, type, price = {}, length, width, height, name, image, illustration } = truck;

    this.id = id;
    this.type = type;
    this.price = price;
    this.height = height;
    this.length = width;
    this.width = width;
    this.name = name;
    this.image = image;
    this.illustration = illustration;

    return sanitize(this);
}

module.exports = Truck;
