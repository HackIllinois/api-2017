var Request = require('./Request');
var registration = require('../utils/registration');


var bodyRequired = ['tshirtSize'];
var bodyValidations = {
	'tshirtSize': ['string', registration.verifyTshirtSize]
};

function RegisteredAdminCreationRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

RegisteredAdminCreationRequest.prototype = Object.create(Request.prototype);
RegisteredAdminCreationRequest.prototype.constructor = RegisteredAdminCreationRequest;

module.exports = RegisteredAdminCreationRequest;
