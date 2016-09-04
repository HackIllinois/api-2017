var Request = require('./Request');
var registration = require('../utils/registration');


var bodyRequired = ['tshirtSize'];
var bodyValidations = {
	'tshirtSize': ['string', registration.verifyTshirtSize]
};

function RegisteredVolunteerCreationRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

RegisteredVolunteerCreationRequest.prototype = Object.create(Request.prototype);
RegisteredVolunteerCreationRequest.prototype.constructor = RegisteredVolunteerCreationRequest;

module.exports = RegisteredVolunteerCreationRequest;
