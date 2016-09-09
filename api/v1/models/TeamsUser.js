/* jshint esversion: 6 */

var database = require('../../database');
var bookshelf = database.instance();

var Model = require('./Model');
var TeamsUser = Model.extend({
	tableName: 'teams_users',
	idAttribute: 'id'
});

/**
 * Returns the Team corresponding to the team_id stored on this TeamUsers
 * instance
 * @return {Promise} resolving to the relational team
 */
TeamsUser.prototype.team = function () {
    return this.belongsTo('Team');
}

/**
 * Uses the team function to fetch the Team of a certain User
 * @return {Promise} resolving to the relational team
 */
TeamsUser.findTeamByUser = function (user) {
	return TeamsUser.where({user_id: user.get('id') }).fetch({withRelated: ['team']})
	.then(function(teamsUser) {
		if(teamsUser)
			return teamsUser.related('team');
		return null;
	});
}
module.exports = bookshelf.model('TeamsUser', TeamsUser);
