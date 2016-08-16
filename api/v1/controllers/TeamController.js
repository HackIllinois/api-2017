var errors = require('../errors');
var services = require('../services');
var roles = require('../utils/roles');

var router = require('express').Router();

function joinTeam (req, res, next) {
  var email = req.auth.email;
  var teamName = req.body['teamName'];
  return services.UserService.findUserByEmail(email)
  .then(function(user){
    return services.TeamService
      .addUserToTeam(user, teamName);
  })
  .then(function(team){
    return team.toJSON();
  })
  .then(function (json){
    res.body = json;

    next();
    return null;
  })
  .catch(function (error) {
    next(error);
    return null;
  });
}

function updateTeam (req, res, next) {
  var email = req.auth.email;
  var teamName = req.body['teamName'];
  services.UserService.findUserByEmail(email)
  .then(function(user){
    return services.TeamService
      .updateUserTeam(user, teamName);
  })
  .then(function(team){
    return team.toJSON();
  })
  .then(function (json){
    res.body = json;

    next();
    return null;
  })
  .catch(function (error) {
    next(error);
    return null;
  });
}

function getTeam(req, res, next) {
  var email = req.auth.email;
  return services.UserService.findUserByEmail(email)
  .then(function(user){
    return services.TeamService.findTeamByUser(user);
  })
  .then(function(team){
    return team.toJSON();
  })
  .then(function (json){
    res.body = json;

    next();
    return null;
  })
  .catch(function (error){
    next(error);
    return null;
  });
}

function removeUserFromTeam(req, res, next) {
  var email = req.auth.email;
  return services.UserService.findUserByEmail(email)
  .then(function(user){
    return services.TeamService
    .removeUserFromTeam(user);
  })
  .then(function(team){
    return team.toJSON();
  })
  .then(function (json){
    res.body = json;

    next();
    return null;
  })
  .catch(function (error){
    next(error);
    return null;
  });
}

router.get('/', getTeam);
router.post('/', joinTeam);
router.put('/', updateTeam);
router.delete('/', removeUserFromTeam);

module.exports.joinTeam = joinTeam;
module.exports.updateTeam = updateTeam;
module.exports.getTeam = getTeam;
module.exports.removeUserFromTeam = removeUserFromTeam;
module.exports.router = router;
