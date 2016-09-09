var errors = require('../errors');
var services = require('../services');
var roles = require('../utils/roles');

var bodyParser = require('body-parser');
var middleware = require('../middleware');
var router = require('express').Router();

function registerUser (req, res, next) {
  var email = req.auth.email;
  services.UserService.findUserByEmail(email)
  .then(function(user){
	return services.RegistrationService
	  .registerUser(user, req.body);
  })
  .then(function(registered){
	res.body = registered.toJSON();

	next();
	return null;
  })
  .catch(function (error) {
	next(error);
	return null;
  });
}

function updateRegistration (req, res, next) {
  var email = req.auth.email;
  services.UserService.findUserByEmail(email)
  .then(function(user){
	return services.RegistrationService.findRegistrationByUser(user);
  })
  .then(function(registration){
	return services.RegistrationService.updateRegistration(registration, req.body);
  })
  .then(function(updatedRegistration){
	res.body = updatedRegistration.toJSON();

	next();
	return null;
  })
  .catch(function (error){
	next(error);
	return null;
  });
}

function getRegistration(req, res, next) {
  var email = req.auth.email;
  services.UserService.findUserByEmail(email)
  .then(function(user){
	return services.RegistrationService.findRegistrationByUser(user);
  })
  .then(function(registration){
	res.body = registration.toJSON();

	next();
	return null;
  })
  .catch(function (error){
	next(error);
	return null;
  });
}

function submitRegistration(req, res, next) {
  var email = req.auth.email;
  services.UserService.findUserByEmail(email)
  .then(function(user){
	return services.RegistrationService.findRegistrationByUser(user);
  })
  .then(function(registration){
	return services.RegistrationService.submitRegistration(registration);
  })
  .then(function(updatedRegistration){
	res.body = updatedRegistration.toJSON();

	next();
	return null;
  })
  .catch(function (error){
	next(error);
	return null;
  });
}

function withdrawSubmission(req, res, next) {
  var email = req.auth.email;
  services.UserService.findUserByEmail(email)
  .then(function(user){
	return services.RegistrationService.findRegistrationByUser(user);
  })
  .then(function(registration){
	return services.RegistrationService.withdrawSubmission(registration);
  })
  .then(function(updatedRegistration){
	res.body = updatedRegistration.toJSON();

	next();
	return null;
  })
  .catch(function (error){
	next(error);
	return null;
  });
}

/**
 * Determines whether or not the requester is registering for the correct role.
 * @throws UnauthorizedError when user is attempting to register for a role
 * other than their own.
 */
function roleMatchesUser(req, res, next) {
  if(req.auth.role !== req.params.role.toUpperCase()){
	return next(new errors.UnauthorizedError());
  }

	// Otherwise, roles must match, and user is authorized
	next();
}

router.use(bodyParser.json());
router.use(middleware.auth);
router.use(middleware.request);

router.get('/:role', middleware.permission(utils.roles.ANY), roleMatchesUser, getRegistration);
router.post('/:role', middleware.permission(utils.roles.ANY), roleMatchesUser, registerUser);
router.put('/:role', middleware.permission(utils.roles.ANY), roleMatchesUser, updateRegistration);

router.post('/submit', middleware.permission(utils.roles.ANY), submitRegistration);
router.delete('/submit', middleware.permission(utils.roles.ANY), withdrawSubmission);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.registerUser = registerUser;
module.exports.updateRegistration = updateRegistration;
module.exports.getRegistration = getRegistration;
module.exports.router = router;
