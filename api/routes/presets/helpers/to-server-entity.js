const sanitize = require("./sanitize");

module.exports = data => {
    return sanitize({
        id: data.id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        categoryId: data.category_id,
        name: data.name,
        width: data.width,
        height: data.height,
        length: data.length,
        weight: data.weight,
        image: data.image
    });
};
