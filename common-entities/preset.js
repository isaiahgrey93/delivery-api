const sanitize = require("./helpers/sanitize");

function Preset(preset) {
    const {
        id,
        name,
        width,
        height,
        length,
        weight,
        categoryId,
        createdAt,
        image
    } = preset;

    this.id = id;
    this.name = name;
    this.width = width;
    this.height = height;
    this.length = length;
    this.weight = weight;
    this.categoryId = categoryId;
    this.createdAt = createdAt;
    this.image = image;

    return sanitize(this);
}
