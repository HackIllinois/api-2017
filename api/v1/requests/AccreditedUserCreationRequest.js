var roles = require('../utils/roles');
var Request = require('./Request');

var required = ['firstName', 'lastName', 'email', 'role'];
var validations = {
	'firstName': ['string', 'maxLength:256'],
	'lastName': ['string', 'maxLength:256'],
	'email': ['email'],
	'role': ['string', roles.verifyRole]
};

// usable whenever a request is made to create a non-hacker user
function AccreditedUserCreationRequest(parameters) {
	Request.call(this, parameters);

	this.required = required;
	this.validations = validations;
}

AccreditedUserCreationRequest.prototype = Object.create(Request.prototype);
AccreditedUserCreationRequest.prototype.constructor = AccreditedUserCreationRequest;

module.exports = AccreditedUserCreationRequest;
