const sanitize = require("./helpers/sanitize");

function Category(category) {
    const { id, name, description, image, userId, createdAt } = category;

    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.userId = userId;
    this.createdAt = createdAt;

    return sanitize(this);
}

module.exports = Category;
