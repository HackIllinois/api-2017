const Request = require('./Request');

const bodyRequired = [];
<<<<<<< HEAD
const bodyAllowed = [ 'comments', 'favorite']
const bodyValidations = {
  'comments': ['string', 'maxLength:255'],
  'favorite': ['natural']
=======
const bodyAllowed = ['comments', 'favorite'];
const bodyValidations = {
  'comments': ['string', 'maxLength:255'],
  'favorite': [ 'boolean' ]
>>>>>>> staging
};

function UpdateRecruiterInterestRequest(headers, body) {
  Request.call(this, headers, body);

  this.bodyRequired = bodyRequired;
  this.bodyValidations = bodyValidations;
<<<<<<< HEAD
  this.bodyAllowed = bodyAllowed
=======
  this.bodyAllowed = bodyAllowed;
>>>>>>> staging
}

UpdateRecruiterInterestRequest.prototype = Object.create(Request.prototype);
UpdateRecruiterInterestRequest.prototype.constructor = UpdateRecruiterInterestRequest;

module.exports = UpdateRecruiterInterestRequest;
