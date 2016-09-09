var Request = require('./Request');
var registration = require('../utils/registration');

var bodyRequired = ['age', 'gender', 'school',  'graduationYear', 'major', 'diet',
	'professionalInterest', 'linkedinUrl', 'githubUrl', 'siteUrl', 'hackathonAttendance',
	'initiatives',  'hardwareDesired', 'openSourceInterests', 'extraInformation', 'tshirtSize'];
var bodyValidations = {
	'age': ['number', 'max:100', 'min:13'],
	'gender': ['string', registration.verifyGender],
	'school': ['string', 'maxLength:255'],
	'graduationYear': ['number', 'between:2016:2021'],
	'major': ['string', 'maxLength:255'],
	'diet': ['string', registration.verifyDiet],
	'professionalInterest': ['string', registration.verifyProfessionalInterest],
	'linkedinUrl': ['url', 'maxLength:255'],
	'githubUrl': ['url', 'maxLength:255'],
	'siteUrl': ['url', 'maxLength:255'],
	'hackathonAttendance': ['string', registration.verifyHackathonAttendance],
	'initiatives': ['array', registration.verifyInitiatives], // assuming initiatives will be passed as an array of strings
	'hardwareDesired': ['string', 'maxLength:255'],
	'openSourceInterests': ['string', 'maxLength:255'],
	'extraInformation': ['string', 'maxLength:255'],
	'tshirtSize': ['string', registration.verifyTshirtSize]
};

function RegisteredHackerCreationRequest(headers, body) {
	Request.call(this, headers, body);

	this.bodyRequired = bodyRequired;
	this.bodyValidations = bodyValidations;
}

RegisteredHackerCreationRequest.prototype = Object.create(Request.prototype);
RegisteredHackerCreationRequest.prototype.constructor = RegisteredHackerCreationRequest;

module.exports = RegisteredHackerCreationRequest;
