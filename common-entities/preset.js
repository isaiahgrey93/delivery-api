const sanitize = require("./helpers/sanitize");

function Preset(preset) {
    const {} = preset;

    this.id = id;

    return sanitize(this);
}
