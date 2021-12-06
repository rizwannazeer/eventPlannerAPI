const authTokken = require('../token')
const users = require("../model/user");

const authentication = async (req, res, next) => {
  if (!req.headers?.authorization) {
    res.statusCode = 401;
    res.send('you are not autherized to see this resource');
    return;
  }
  const authorization = req.headers?.authorization;
  console.log(authTokken.verifyAccessToken(authorization));
  try {
    const user = await users.me(authTokken.verifyAccessToken(authorization));
    if (!user) {
      res.statusCode = 401;
      res.send('invalid access token');
      return;
    }
    req.body.ownerEmail = user.email;
    next();
  } catch (er) {
    console.error(er);
    res.statusCode = 500;
    res.send({ error: 'something went wrong' })
  }
}

module.exports = authentication;