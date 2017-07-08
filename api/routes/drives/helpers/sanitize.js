function sanitize(data) {
    let keys = Object.keys(data);

    keys.forEach(key => {
        let val = data[key];

        if (val === undefined || val === null || val === {} || val === []) {
            delete data[key];
        }

        if (val instanceof Date) return;

        if (val && typeof val === "object") {
            let result = sanitize(data[key]);

            if (Object.keys(result).length === 0) {
                delete data[key];
            }
        }
    });

    return data;
}

module.exports = sanitize;
