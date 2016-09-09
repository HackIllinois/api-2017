/* jshint esversion: 6 */
var _ = require('lodash');

var database = require('../../database');
var bookshelf = database.instance();

var Model = require('./Model');
var Team = Model.extend({
	tableName: 'teams',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
		name: ['required', 'string', 'maxLength:255'],
		size: [	'required',
						'integer',
						{ rule: 'lessThanEqualTo:4',	message: "The given team can not hold any more users"}
					]
	}
});

/**
 * Returns the Users on this team
 * @return {Promise} resolving to a collection of Users on this team
 */
Team.prototype.allUsers = function() {
	return this.belongsToMany('User').through('TeamsUser').fetch();
}

/**
 * Serializes this Team
 * @return {Object} the serialized form of this Team instance
 */
Team.prototype.toJSON = function () {
	var ret = this.attributes;
	//If the team was deleted, its attributes will be empty.
	if(_.isEmpty(ret)){
		return ret;
	}
	return this.allUsers()
	.then( function(result) {
		ret["users"] = _.map(result.toJSON(), function(user){
			return user.firstName + " " + user.lastName;
		});
		return Promise.resolve(ret);
	});
};

module.exports = bookshelf.model('Team', Team);
