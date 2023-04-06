const jwt = require('jsonwebtoken');

let ref = "";
function createJWT(req) {
    const payload = {
        iss: "Todo"
    };
    const accessToken = token.getAccessToken(payload);
    const refreshToken = token.getRefreshToken(payload);

    ref = refreshToken;

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

function refreshJWT(req) {
    if(ref === req.headers.authorization) {
        const accessToken = token.getAccessToken({
            iss: "jwt-redis"
        });

        const result = {
            code: 200,
            accessToken: accessToken
        }
        
        return result;
    }else {
        new Error("Unauthorized Token");
    }
}

module.exports = {createJWT, refreshJWT};
