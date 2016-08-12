var _ = require('lodash');

var TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
var GENDERS = ['NONE', 'MALE', 'FEMALE', 'NON_BINARY', 'OTHER'];
var DIETS = ['NONE', 'VEGETARIAN', 'VEGAN', 'GLUTEN_FREE'];
var PROFESSIONAL_INTERESTS = ['NONE', 'FULL_TIME', 'INTERNSHIP', 'BOTH'];
var HACKATHON_ATTENDANCE_OPTIONS = ['0', '1-5', '5+'];
var INITIATIVES = ['SOFTWARE', 'HARDWARE', 'OPEN_SOURCE'];

/**
 * Ensures that the provided tshirt-size is in the list
 * of valid size options
 * @param  {String} size the value to check
 * @return {Boolean} true when the size is valid
 * @throws TypeError when the size is invalid
 */
module.exports.verifyTshirtSize = function (size) {
	if (!_.includes(TSHIRT_SIZES, size)) {
		throw new TypeError(size + " is not a valid size");
	}

	return true;
};

module.exports.verifyGender = function (gender) {
 if (!_.includes(GENDERS, gender)) {
   throw new TypeError(gender + " is not a valid gender");
 }

 return true;
};

module.exports.verifyDiet = function (diet) {
 if (!_.includes(DIETS, diet)) {
   throw new TypeError(diet + " is not a valid diet");
 }

 return true;
};

module.exports.verifyProfessionalInterest = function (interest) {
 if (!_.includes(PROFESSIONAL_INTERESTS, interest)) {
   throw new TypeError(interest + " is not a valid professional interest");
 }

 return true;
};

module.exports.verifyHackathonAttendance = function (attendance) {
 if (!_.includes(HACKATHON_ATTENDANCE_OPTIONS, attendance)) {
   throw new TypeError(attendance + " is not a valid attendance option");
 }

 return true;
};


module.exports.verifyInitiatives= function (initiatives) {
  for(var i = 0; i < initiatives.length; i++){
		var initiative = initiatives[i];
    if (!_.includes(INITIATIVES, initiative)) {
     throw new TypeError(initiative + " is not a valid initiative");
    }
  }
  return true;
};
