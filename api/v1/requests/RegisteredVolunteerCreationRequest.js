var Request = require('./Request');
var registration = require('../utils/registration');


var required = ['tshirtSize'];
var validations = {
	'tshirtSize': ['string', registration.verifyTshirtSize]
};

function RegisteredVolunteerCreationRequest(parameters) {
	Request.call(this, parameters);

	this.required = required;
	this.validations = validations;
}

RegisteredVolunteerCreationRequest.prototype = Object.create(Request.prototype);
RegisteredVolunteerCreationRequest.prototype.constructor = RegisteredVolunteerCreationRequest;

module.exports = RegisteredVolunteerCreationRequest;
