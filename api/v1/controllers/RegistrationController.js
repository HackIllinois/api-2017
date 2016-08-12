var services = require('../services');
var roles = require('../utils/roles');

var router = require('express').Router();

function registerUser (req, res, next) {
  var email = req.auth.email;
  services.UserService.findUserByEmail(email)
  .then(function(user){
    return services.RegistrationService
      .registerUser(user, req.body);
  })
  .then(function(registered){
		res.body = registered.toJSON();
    
    next();
    return null;
  })
  .catch(function (error) {
    next(error);
    return null;
  });
}

function updateRegistration (req, res, next) {
  var email = req.auth.email;
  services.UserService.findUserByEmail(email)
  .then(function(user){
    return services.RegistrationService.findRegistrationByUser(user);
  })
  .then(function(registration){
    return services.RegistrationService.updateRegistration(registration, req.body);
  })
  .then(function(updatedRegistration){
    res.body = updatedRegistration.toJSON();

    next();
    return null;
  })
  .catch(function (error){
    next(error);
    return null;
  });
}

router.post('/:role', registerUser);
router.put('/:role', updateRegistration);

module.exports.registerUser = registerUser;
module.exports.updateRegistration = updateRegistration;
module.exports.router = router;
