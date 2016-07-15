var Request = require('./Request');
var registration = require('../utils/registration');


var required = ['tshirtSize', 'organization'];
var validations = {
	'tshirtSize': ['string', registration.verifyTshirtSize],
	'organization': ['string', 'between:0:256']
};

// usable whenever a request is made to create a Hacker
function RegisteredMentorCreationRequest(parameters) {
	Request.call(this, parameters);

	this.required = required;
	this.validations = validations;
}

RegisteredMentorCreationRequest.prototype = Object.create(Request.prototype);
RegisteredMentorCreationRequest.prototype.constructor = RegisteredMentorCreationRequest;

module.exports = RegisteredMentorCreationRequest;
