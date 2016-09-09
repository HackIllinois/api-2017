var Request = require('./Request');

var bodyRequired = ['firstName', 'lastName', 'email', 'password', 'confirmedPassword'];
var bodyValidations = {
	'firstName': ['string', 'maxLength:255'],
	'lastName': ['string', 'maxLength:255'],
	'email': ['email'],
	'password': ['string', 'minLength:8'],
	'confirmedPassword': [{ rule: 'matchesField:password',
		message: "The confirmed password must match the password" }]
};

// usable whenever a request is made to create a Hacker
function HackerUserCreationRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

HackerUserCreationRequest.prototype = Object.create(Request.prototype);
HackerUserCreationRequest.prototype.constructor = HackerUserCreationRequest;

module.exports = HackerUserCreationRequest;
