const sanitize = require("./sanitize");

module.exports = data => {
    return sanitize({
        id: data.id,
        created_at: data.createdAt,
        updated_at: data.updatedAt,
        description: data.description,
        user_id: data.userId,
        name: data.name,
        image: data.image
    });
};
