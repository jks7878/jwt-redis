const jwt = require('jsonwebtoken');

function createJWT() {
    const payload = {
        iss: "jwt-redis"
    };

    const accessToken = jwt.sign(payload, "secret" , {subject: "access token", expiresIn: "5s"});
    const refreshToken = jwt.sign(payload, "secret" , {subject: "refresh token", expiresIn: "10s"});

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

async function verifyToken(token) {
    let result = {};
    await jwt.verify(token, "secret", (err, res) => {
        result = res;
    });

    return result;
}

module.exports = { createJWT, verifyToken }
