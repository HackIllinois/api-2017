var bodyParser = require('body-parser');

var errors = require('../errors');
var services = require('../services');
var config = require('../../config');
var middleware = require('../middleware');

var roles = require('../utils/roles');

var router = require('express').Router();

function _isAuthenticated (req) {
	return req.auth && (req.user !== undefined);
}

function createMentor(req, res, next) {
	delete req.body.status;

	services.RegistrationService.createMentor(req.body, req.user)
		.then(function (mentor) {
			res.body = mentor.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function fetchMentorByUser(req, res, next) {
  services.RegistrationService.findMentorByUserId(req.user.get('id'))
  .then(function(mentor){
	res.body = mentor.toJSON();

	next();
	return null;
  })
  .catch(function (error) {
	next(error);
	return null;
  });
}

function fetchMentorById(req, res, next) {
	services.RegistrationService.findMentorById(req.params.id)
		.then(function(mentor){
			res.body = mentor.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function updateMentorByUser(req, res, next) {
	if (!req.user.hasRoles(utils.roles.ORGANIZERS)) {
		delete req.body.status;
	}

	services.RegistrationService.updateMentorByUser(req.body, req.user)
		.then(function(mentor){
			res.body = mentor.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

function updateMentorById(req, res, next) {
	if (!req.user.hasRoles(utils.roles.ORGANIZERS)) {
		delete req.body.status;
	}

	services.RegistrationService.updateMentorById(req.body, req.params.id)
		.then(function(mentor){
			res.body = mentor.toJSON();

			next();
			return null;
		})
		.catch(function (error) {
			next(error);
			return null;
		});
}

router.use(bodyParser.json());
router.use(middleware.auth);
router.use(middleware.request);

router.post('/mentor', middleware.permission(roles.NONE, _isAuthenticated), createMentor);
router.get('/mentor', middleware.permission(roles.MENTOR), fetchMentorByUser);
router.get('/mentor/:id', middleware.permission(roles.ORGANIZERS), fetchMentorById);
router.put('/mentor', middleware.permission(roles.MENTOR), updateMentorByUser);
router.put('/mentor/:id', middleware.permission(roles.ORGANIZERS), updateMentorById);

router.use(middleware.response);
router.use(middleware.errors);

module.exports.router = router;
