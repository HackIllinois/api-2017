var Admin = require('../models/Admin');
var Mentor = require('../models/Mentor');
var Sponsor = require('../models/Sponsor');
var Staff = require('../models/Staff');
var Volunteer = require('../models/Volunteer');
var Hacker = require('../models/Hacker');

var roles = require('../utils/roles');
var models = {};

models[roles.ADMIN] =  Admin;
models[roles.MENTOR] =  Mentor;
models[roles.SPONSOR] =  Sponsor;
models[roles.STAFF] =  Staff;
models[roles.VOLUNTEER] =  Volunteer;
models[roles.HACKER] =  Hacker;


/**
 * Finds a registration by its relational user
 * @param  {Object} user the user to query
 * @return {Object} the possible (one) matching registration, or undefined
 */
function _findRegistrationByUser (user) {
	if (user) {
    var model = models[user.attributes.role];
		return model.query().where('user_id', user.attributes.id).fetchOne();
	}

	return Promise.resolve(undefined);
}

/**
 * Finds a registration by the given user
 * @param  {Object} user the user to query
 * @return {Promise} resolving to an instance of the associated registration model
 * @throws {NotFoundError} when the requested registration cannot be found
 */
module.exports.findRegistrationByUser(user) = function(user){
  var model = models[user.attributes.role];
	return _findRegistrationByUser(user)
		.then(function (result) {
			if (!result) {
				var message = "A registration for the given user cannot be found";
				var source = "user";
				throw new errors.NotFoundError(message, source);
			}

			return Promise.resolve(result);
		});
}

/**
 * Creates a registration for the supplied user.
 * @param  {Object} user the user being registered
 * @param  {Object} registration the object containing the registration parameters
 * @return {Promise} resolving to the newly-created registration instance
 * @throws InvalidParameterError when a registration exists with the specified user
 */
module.exports.registerUser = function(user, registration){
  var model = models[user.attributes.role];
  model.forge(registration);
  model
		.validate()
		.catch(Checkit.Error, utils.errors.handleValidationError)
		.then(function (validated) {
			return _findRegistrationByUser(user);
		})
		.then(function (result) {
			if (result) {
				var message = "A registration for the given user already exists";
				var source = "user";
				throw new errors.InvalidParameterError(message, source);
			}
		})
		.then(function () {
			return model.save();
		})
		.then(function (registration) {
			return Promise.resolve(registration);
		});
}


/**
 * Updates an existing registration instance with the registration passed.
 * @param  {Object} registrationInstance the registration being updated
 * @param  {Object} registration the object containing the registration parameters
 * @return {Promise} resolving to the updated registration instance
 */
module.exports.updateRegistration = function(registrationInstance, registration){
  registrationInstance.set(registration);
  registrationInstance
		.validate()
		.catch(Checkit.Error, utils.errors.handleValidationError)
		.then(function (validated) {
      return model.save();
		})
		.then(function (registration) {
			return Promise.resolve(registration);
		});
}
