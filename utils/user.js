const JWT = require("jsonwebtoken");

module.exports = {
    grantJSONWebToken: user => {
        return JWT.sign(user, process.env.JWT_SECRET, { algorithm: "HS256" });
    }
};
