var Request = require('./Request');
var registration = require('../utils/registration');


var bodyRequired = ['tshirtSize', 'organization'];
var bodyValidations = {
	'tshirtSize': ['string', registration.verifyTshirtSize],
	'organization': ['string', 'maxLength:255']
};

function RegisteredSponsorCreationRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

RegisteredSponsorCreationRequest.prototype = Object.create(Request.prototype);
RegisteredSponsorCreationRequest.prototype.constructor = RegisteredSponsorCreationRequest;

module.exports = RegisteredSponsorCreationRequest;
