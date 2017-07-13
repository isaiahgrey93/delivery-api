const sanitize = require("../sanitize");
const Preset = require("./preset");

module.exports = data => {
    const { presets = [] } = data;

    return sanitize({
        id: data.id,
        created_at: data.createdAt,
        updated_at: data.updatedAt,
        description: data.description,
        user_id: data.userId,
        presets: presets.map(p => Preset(p)),
        name: data.name,
        image: data.image
    });
};
