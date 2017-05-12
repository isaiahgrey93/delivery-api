function sanitize(data) {
  let keys = Object.keys(data);

  keys.forEach(key => {
    let val = data[key];

    if (val && typeof val === "object") {
      return sanitize(data[key]);
    }

    if (val === undefined || val === null || val === {} || val === []) {
      delete data[key];
    }
  });

  return data;
}

module.exports = sanitize;
