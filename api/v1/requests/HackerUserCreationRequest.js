var Request = require('./Request');

var required = ['firstName', 'lastName', 'email', 'password', 'confirmedPassword'];
var validations = {
	'firstName': ['string', 'between:0:256'],
	'lastName': ['string', 'between:0:256'],
	'email': ['email'],
	'password': ['string', 'minLength:8'],
	'confirmedPassword': [{ rule: 'matchesField:password',
		message: "The confirmed password must match the password" }]
};

function HackerUserCreationRequest(parameters) {
	Request.call(this, parameters);

	this.required = required;
	this.validations = validations;
}

HackerUserCreationRequest.prototype = Object.create(Request.prototype);
HackerUserCreationRequest.prototype.constructor = HackerUserCreationRequest;

module.exports = HackerUserCreationRequest;
