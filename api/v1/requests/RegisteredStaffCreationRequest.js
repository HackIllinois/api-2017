var Request = require('./Request');
var registration = require('../utils/registration');


var bodyRequired = ['tshirtSize'];
var bodyValidations = {
	'tshirtSize': ['string', registration.verifyTshirtSize]
};

function RegisteredStaffCreationRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

RegisteredStaffCreationRequest.prototype = Object.create(Request.prototype);
RegisteredStaffCreationRequest.prototype.constructor = RegisteredStaffCreationRequest;

module.exports = RegisteredStaffCreationRequest;
