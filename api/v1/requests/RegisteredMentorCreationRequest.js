var Request = require('./Request');
var registration = require('../utils/registration');


var required = ['tshirtSize', 'organization'];
var validations = {
	'tshirtSize': ['string', registration.verifyTshirtSize],
	'organization': ['string', 'maxLength:255']
};

function RegisteredMentorCreationRequest(parameters) {
	Request.call(this, parameters);

	this.required = required;
	this.validations = validations;
}

RegisteredMentorCreationRequest.prototype = Object.create(Request.prototype);
RegisteredMentorCreationRequest.prototype.constructor = RegisteredMentorCreationRequest;

module.exports = RegisteredMentorCreationRequest;
