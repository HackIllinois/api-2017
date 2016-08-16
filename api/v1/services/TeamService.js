var Checkit = require('checkit');
var Promise = require('bluebird');

var Team = require('../models/Team');
var TeamsUser = require('../models/TeamsUser');
var errors = require('../errors');
var utils = require('../utils');

/**
 * Finds a team by its name
 * @param  {String} name the name to query
 * @return {Promise} the possible (one) matching team, or undefined
 */
function _findTeamByName (name) {
	if (name) {
		name = name.toLowerCase();
		return Team.query('where', 'name', '=', name).fetch();
	}

	return Promise.resolve(undefined);
}

/**
 * Finds a teamsUser instance by its relational user
 * @param  {Object} user the user to query
 * @return {Promise} the possible (one) matching teamsUser, or undefined
 */
function _findTeamsUserByUser (user) {
	if (user) {
		return TeamsUser.query('where', 'user_id', '=', user.attributes.id).fetch();
	}

	return Promise.resolve(undefined);
}

/**
 * Finds a team by its id
 * @param  {Number} id the ID to query
 * @return {Promise} the possible (one) matching team, or undefined
 */
function _findTeamById (id) {
	if (id) {
		return Team.query('where', 'id', '=', id).fetch();
	}

	return Promise.resolve(undefined);
}

/**
 * Finds a team by the given name
 * @param  {String} name the name to query
 * @return {Promise} resolving to an instance of the associated team
 * @throws {NotFoundError} when the requested team cannot be found
 */
module.exports.findTeamByName = function(name){
	return _findTeamByName(name)
	.then(function (result) {
		if (!result) {
			var message = "A team with the given name cannot be found";
			var source = "name";
			throw new errors.NotFoundError(message, source);
		}

		return Promise.resolve(result);
	});
}

/**
 * Finds a team by the given ID
 * @param  {Number} id the ID to query
 * @return {Promise} resolving to an instance of the associated team
 * @throws {NotFoundError} when the requested team cannot be found
 */
module.exports.findTeamById = function(id){
	return _findTeamById(id)
	.then(function (result) {
		if (!result) {
			var message = "A team with the given ID cannot be found";
			var source = "id";
			throw new errors.NotFoundError(message, source);
		}

		return Promise.resolve(result);
	});
}

/**
 * Finds a team by the given user
 * @param  {Object} user the user to query
 * @return {Promise} resolving to an instance of the associated team
 * @throws {NotFoundError} when the requested team cannot be found
 */
module.exports.findTeamByUser = function(user){
	return user.team()
	.then(function (result) {
		if (!result) {
			var message = "A team for the given user cannot be found";
			var source = "user";
			throw new errors.NotFoundError(message, source);
		}

		return Promise.resolve(result);
	});
}

/**
 * Creates a team with the supplied name.
 * @param  {String} name the name of the team
 * @return {Promise} resolving to the newly-created team instance
 * @throws InvalidParameterError when a team exists with the specified name
 */
function _createTeam (name){
	var team = Team.forge({name: name, size: 0});
	return team
	.validate()
	.catch(Checkit.Error, utils.errors.handleValidationError)
	.then(function (validated) {
		return _findTeamByName(name);
	})
	.then(function (result) {
		if (result) {
			var message = "A team with the given name already exists";
			var source = "name";
			throw new errors.InvalidParameterError(message, source);
		}
		return team;
	})
	.then(function () {
		return team.save();
	})
	.then(function(result) {
		return Promise.resolve(result);
	});
}

/**
 * Adds a user to a team and validates it
 * @return {Promise} the updated team
 * @throws InvalidParameterError when the team is already at capacity
 */
function _addToTeam (team) {
	team.set({size: team.attributes.size + 1});
	return team
	.validate()
	.catch(Checkit.Error, utils.errors.handleValidationError)
	.then(function (validated){
		return team;
	});
}


/**
 * Adds a user to the team with the supplied name.
 * User must not already have a team.
 * Will create team if non-existent.
 * @param  {Object} user the user instance to add to the team
 * @param  {String} name the name of the team
 * @return {Promise} resolving to the updated team instance
 * @throws InvalidParameterError when Checkit validation fails or when User already has a team.
 */
module.exports.addUserToTeam = function(user, name){
	return _findTeamByName(name)
	.then(function(result){
		if (result) {
			return result;
		}
		return _createTeam(name);
	})
	.then(function (team) {
		return _addToTeam(team);
	})
	.then(function (team){
		var teamUserRelationship = TeamsUser.forge({userId: user.attributes.id, teamId: team.attributes.id});
		return _findTeamsUserByUser(user)
		.then(function (result) {
			if (result) {
				var message = "A team for the given user already exists";
				var source = "user";
				throw new errors.InvalidParameterError(message, source);
			}
			//No problems - changes can be finalized
			teamUserRelationship.save();
			return team.save();
		})
	})
	.then(function(result){
		return Promise.resolve(result);
	});
}

/**
 * Updates a user to the team with the supplied name.
 *  Will create team if non-existent.
 * @param  {Object} user the user instance to add to the team
 * @param  {String} name the name of the team
 * @return {Promise} resolving to the updated team instance
 * @throws InvalidParameterError	when Checkit validation fails, when user updates
 *	to same team, or when user doesn't have a team.
 */
module.exports.updateUserTeam = function(user, name){
	return user.team()
	.then(function (oldTeam){
		if(!oldTeam){
			var message = "A team for the given user doesn't exist.";
			var source = "user";
			throw new errors.NotFoundError(message, source);
		}
		if(oldTeam.attributes.name == name){
			var message = "Cannot update to a team of the same name as prior team";
			var source = "name";
			throw new errors.InvalidParameterError(message, source);
		}
		return _findTeamByName(name)
		.then(function(result){
			if (result) {
				return result;
			}
			return _createTeam(name);
		})
		.then(function (team) {
			return _addToTeam(team);
		})
		.then(function (team){
			return _findTeamsUserByUser(user)
			.then(function (result) {
				//Finalize all changes
				//TeamsUser instance must be changed before possibility of oldTeam deletion
				result.set({teamId: team.attributes.id})
				return result.save()
				.then(function(){
					oldTeam.set({size: oldTeam.attributes.size - 1});
					if(oldTeam.attributes.size == 0){
						return oldTeam.destroy();
					}
					else {
						return oldTeam.save();
					}
				})
				.then(function(){
					return team.save();
				});
			});
		});
	})
	.then(function(result){
		return Promise.resolve(result);
	});
}

/**
 * Removes a user from the team they're on.
 * @param  {Object} user the user instance to remove from their team
 * @return {Promise} resolving to the updated team instance
 * @throws NotFoundError when user isn't on team.
 */
module.exports.removeUserFromTeam = function(user){
	return _findTeamsUserByUser(user)
	.then(function (result) {
		if (!result) {
			var message = "A team for the given user doesn't exist";
			var source = "user";
			throw new errors.NotFoundError(message, source);
		}
		return _findTeamById(result.attributes.teamId)
		.then(function(team){
			//Changes can be finalized.
			//TeamsUser instance must be changed before possibility of team deletion
			return result.destroy()
			.then(function(){
				//Team size of 0
				team.set({size: team.attributes.size - 1});
				if(team.attributes.size == 0){
					return team.destroy();
				}
				return team.save();
			})
		});
	})
	.then(function(result){
		return Promise.resolve(result);
	});
}
