var Request = require('./Request');
var registration = require('../utils/registration');


var required = ['age', 'gender', 'school',  'graduationYear', 'major', 'diet', 'professionalInterest', 'linkedinUrl', 'githubUrl', 'siteUrl', 'hackathonAttendance', 'initiatives',  'hardwareDesired', 'openSourceInterests', 'extraInformation', 'tshirtSize'];
var validations = {
	'age': ['number', 'max:100', 'min:13'],
	'gender': ['string', registration.verifyGender],
	'school': ['string', 'maxLength:256'],
	'graduationYear': ['number', 'max:2020', 'min:2017'],
	'major': ['string', 'maxLength:256'],
	'diet': ['string', registration.verifyDiet],
	'professionalInterest': ['string', registration.verifyProfessionalInterest],
	'linkedinUrl': ['url', 'maxLength:256'],
	'githubUrl': ['url', 'maxLength:256'],
	'siteUrl': ['url', 'maxLength:256'],
  'hackathonAttendance': ['string', registration.verifyHackathonAttendance],
  //Assuming initiatives will be passed as an array of strings
  'initiatives': ['array', registration.verifyInitiatives],
  'hardwareDesired': ['string', 'maxLength:256'],
  'openSourceInterests': ['string', 'maxLength:256'],
  'extraInformation': ['string', 'maxLength:256'],
	'tshirtSize': ['string', registration.verifyTshirtSize]
};

function RegisteredHackerCreationRequest(parameters) {
	Request.call(this, parameters);

	this.required = required;
	this.validations = validations;
}

RegisteredHackerCreationRequest.prototype = Object.create(Request.prototype);
RegisteredHackerCreationRequest.prototype.constructor = RegisteredHackerCreationRequest;

module.exports = RegisteredHackerCreationRequest;
