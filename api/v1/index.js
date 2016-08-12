var express = require('express');

var controllers = require('./controllers');
var middleware = require('./middleware');

var v1 = express.Router();

v1.use(middleware.auth);
v1.use(middleware.request);

v1.use('/auth', controllers.AuthController.router);
v1.use('/user', controllers.UserController.router);
v1.use('/registration', controllers.RegistrationController.router);

v1.use(middleware.response);
v1.use(middleware.errors);

module.exports = v1;
