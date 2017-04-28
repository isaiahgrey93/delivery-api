const sanitize = require("./helpers/sanitize");

function Recording(recording) {
    const {} = recording;

    this.id = id;

    return sanitize(this);
}
