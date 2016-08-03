/* jshint esversion: 6 */

var registration = require('../utils/registration');

var Model = require('./Model');
var Hacker = Model.extend({
	tableName: 'hackers',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
		userId: ['required', 'integer']
		age: ['number', 'max:100', 'min:13'],
		gender: ['string', registration.verifyGender],
		school: ['string', 'between:0:256'],
		graduationYear: ['number', 'max:2020', 'min:2017'],
		major: ['string', 'between:0:256'],
		diet: ['string', registration.verifyDiet],
		professionalInterest: ['string', registration.verifyProfessionalInterest],
		linkedinUrl: ['url', 'between:0:256'],
		githubUrl: ['url', 'between:0:256'],
		siteUrl: ['url', 'between:0:256'],
	  hackathonAttendance: ['string', registration.verifyHackathonAttendance],
	  //Assuming initiatives will be passed as an array of strings
	  initiatives: ['array', registration.verifyInitiatives],
	  hardwareDesired: ['string', 'between:0:256'],
	  openSourceInterests: ['string', 'between:0:256'],
	  extraInformation: ['string', 'between:0:256'],
		tshirtSize: ['string', registration.verifyTshirtSize]
	}
});

module.exports = Hacker;
