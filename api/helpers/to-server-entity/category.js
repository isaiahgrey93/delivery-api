const sanitize = require("../sanitize");

module.exports = data => {
    return sanitize({
        id: data.id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        description: data.description,
        userId: data.user_id,
        name: data.name,
        image: data.image
    });
};
