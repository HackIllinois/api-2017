var Request = require('./Request');
var registration = require('../utils/registration');


var bodyRequired = ['tshirtSize', 'organization'];
var bodyValidations = {
	'tshirtSize': ['string', registration.verifyTshirtSize],
	'organization': ['string', 'maxLength:255']
};

function RegisteredMentorCreationRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

RegisteredMentorCreationRequest.prototype = Object.create(Request.prototype);
RegisteredMentorCreationRequest.prototype.constructor = RegisteredMentorCreationRequest;

module.exports = RegisteredMentorCreationRequest;
