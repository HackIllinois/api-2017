var services = require('../services');
var roles = require('../utils/roles');

var router = require('express').Router();

function registerUser (req, res, next) {
  var email = req.auth.email;
  services.UserService.findUserByEmail(email).then(function(user){
    services.RegistrationService
  		.registerUser(user, req.body)
  		.then(function (registration) {
        //Callback here
  		})
  		.catch(function (error) {
  			next(error);
  			return null;
  		});
  });
}

function updateRegistration (req, res, next) {
  var email = req.auth.email;
  services.UserService.findUserByEmail(email).then(function(user){
    services.RegistrationService.findRegistrationByUser(user).then(function(registration){
      services.RegistrationService.updateRegistration(registration, req.body)
      .then(function(updatedRegistration){
        //callback here
      })
      .catch(function (error){
        next(error);
        return null;
      });
    });
  });
}

router.post('/registration/:role', registerUser);
router.update('registration/:role', updateRegistration);

module.exports.registerUser = registerUser;
module.exports.updateRegistration = updateRegistration;
module.exports.router = router;
