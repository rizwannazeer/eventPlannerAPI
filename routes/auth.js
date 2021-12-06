var express = require('express');
const authTokken = require('../token')
const users = require("../model/user");
var auth = express.Router();

auth.post('/signin', async function (req, res) {
  if (!req.body || !req.body.email || !req.body.password) {
    res.statusCode = 400;
    res.send('invalid request');
    return;
  }
  const { email, password } = req.body;
  try {
    const user = await users.findUserByEmail(email);
    if (!user) {
      res.statusCode = 401;
      res.send('No user registered with this email');
      return;
    }
    if(password !== user.password){
      res.statusCode = 401;
      res.send('Password incorrect');
      return;
    }
    const access_token = authTokken.generateAccessToken(user);
    res.send({ access_token, user_type: user.userType, firstName: user.firstName, lastName: user.lastName });
  } catch (error) {
    res.statusCode = 500;
    res.send({ error: 'something went wrong' })
  }
});

auth.post('/signup', async function (req, res) {
  console.log('request body', req.body);
  if (!req.body || !req.body.email || !req.body.password) {
    res.statusCode = 400;
    res.send(`invalid request, ${!req.body.email ? 'email' : 'password'} is required`);
    return;
  }

  if (!req.body.firstName || !req.body.lastName) {
    res.statusCode = 400;
    res.send(`invalid request, ${!req.body.firstName ? 'firstName' : 'lastName'} is required`);
    return;
  }

  if (!req.body.phone || !req.body.userName) {
    res.statusCode = 400;
    res.send(`invalid request, ${!req.body.phone ? 'phone' : 'userName'} is required`);
    return;
  }

  try {
    const message = await users.createUser({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      userName: req.body.userName,
      userType: req.body.userType,
    })
    res.send(message);
  } catch (error) {
    res.statusCode = 500;
    res.send({ error: 'something went wrong' })
  }

});

auth.get('/me', async function (req, res) {
  if(!req.headers?.authorization) {
    res.statusCode = 401;
    res.send('you are not autherized to see this resource');
    return;
  }
  const authorization = req.headers?.authorization;
  console.log(authTokken.verifyAccessToken(authorization));
  try {
    const user = await users.me(authTokken.verifyAccessToken(authorization));
    if(!user) {
      res.statusCode = 401;
      res.send('invalid access token');
    }
    const response = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      userName: user.userName,
      userType: user.userType
    }
    res.send(response);
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.send({ error: 'something went wrong' })
  }
})

module.exports = auth;