var roles = require('../utils/roles');
var Request = require('./Request');

var bodyRequired = ['firstName', 'lastName', 'email', 'role'];
var bodyValidations = {
	'firstName': ['string', 'maxLength:255'],
	'lastName': ['string', 'maxLength:255'],
	'email': ['email'],
	'role': ['string', roles.verifyRole]
};

// usable whenever a request is made to create a non-hacker user
function AccreditedUserCreationRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

AccreditedUserCreationRequest.prototype = Object.create(Request.prototype);
AccreditedUserCreationRequest.prototype.constructor = AccreditedUserCreationRequest;

module.exports = AccreditedUserCreationRequest;
