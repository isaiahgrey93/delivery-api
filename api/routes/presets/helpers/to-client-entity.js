const sanitize = require("./sanitize");

module.exports = data => {
    return sanitize({
        id: data.id,
        created_at: data.createdAt,
        updated_at: data.updatedAt,
        category_id: data.categoryId,
        name: data.name,
        width: data.width,
        height: data.height,
        length: data.length,
        weight: data.weight,
        image: data.image
    });
};
