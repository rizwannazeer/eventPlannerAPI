var jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign(user.email, 'jwtTokken');
}

const verifyAccessToken = (token) => {
    return jwt.verify(token, 'jwtTokken')
}

module.exports ={
    generateAccessToken,
    verifyAccessToken
}