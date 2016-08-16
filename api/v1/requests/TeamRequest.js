var Request = require('./Request');

var required = ['teamName'];
var validations = {
	'teamName': ['string', 'maxLength:255']
};

function TeamRequest(parameters) {
	Request.call(this, parameters);

	this.required = required;
	this.validations = validations;
}

TeamRequest.prototype = Object.create(Request.prototype);
TeamRequest.prototype.constructor = TeamRequest;

module.exports = TeamRequest;
