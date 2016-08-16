var Request = require('./Request');
var registration = require('../utils/registration');


var required = ['tshirtSize', 'organization'];
var validations = {
	'tshirtSize': ['string', registration.verifyTshirtSize],
	'organization': ['string', 'maxLength:255']
};

function RegisteredSponsorCreationRequest(parameters) {
	Request.call(this, parameters);

	this.required = required;
	this.validations = validations;
}

RegisteredSponsorCreationRequest.prototype = Object.create(Request.prototype);
RegisteredSponsorCreationRequest.prototype.constructor = RegisteredSponsorCreationRequest;

module.exports = RegisteredSponsorCreationRequest;
