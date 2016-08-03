var Request = require('./Request');
var registration = require('../utils/registration');


var required = ['tshirtSize'];
var validations = {
	'tshirtSize': ['string', registration.verifyTshirtSize]
};

function RegisteredStaffCreationRequest(parameters) {
	Request.call(this, parameters);

	this.required = required;
	this.validations = validations;
}

RegisteredStaffCreationRequest.prototype = Object.create(Request.prototype);
RegisteredStaffCreationRequest.prototype.constructor = RegisteredStaffCreationRequest;

module.exports = RegisteredStaffCreationRequest;
