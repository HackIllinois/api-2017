/* jshint esversion: 6 */

var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var _ = require('lodash');

var database = require('../../database');
var bookshelf = database.instance();

var crypto = require('../utils/crypto');
var roles = require('../utils/roles');
var services = require('../services');

const SALT_ROUNDS = 12;

var Model = require('./Model');
var User = Model.extend({
	tableName: 'users',
	idAttribute: 'id',
	hasTimestamps: ['created', 'updated'],
	validations: {
	  firstName: ['required', 'string', 'maxLength:255'],
	  lastName: ['required', 'string', 'maxLength:255'],
		email: ['required', 'email'],
		password: ['required', 'string', 'minLength:8'],
		role: ['required', 'string', roles.verifyRole]
	}
});


/**
 * Returns the Team this User instance is on
 * @return {Promise} resolving to the user's team
 */
User.prototype.team = function () {
  var TeamsUser = bookshelf.model('TeamsUser')
	return TeamsUser.findTeamByUser(this);
}

/**
 * Finds a user by its email address
 * @param  {String} 			email the email address
 * @return {Promise<User>}      the found user, or null
 */
User.findByEmail = function (email) {
	email = email.toLowerCase();
	return this.collection().query({ where: { email: email } }).fetchOne();
};

/**
 * Securely sets a user's password without persisting any changes
 * @param {String} password a secure password of arbitrarily-long length
 * @return {Promise} a Promise resolving to the updated User model
 */
User.prototype.setPassword = function (password) {
	password = crypto.hashWeak(password);
	return bcrypt
		.hashAsync(password, SALT_ROUNDS)
		.bind(this)
		.then(function (p) {
			return Promise.resolve(this.set({ password: p }));
		});
};

/**
 * Securely determines whether or not a password matches this user's password
 * @param  {String}  password an input of arbitrarily-long length
 * @return {Promise} resolving to a Boolean representing the validity
 * of the provided password
 */
User.prototype.hasPassword = function (password) {
	password = crypto.hashWeak(password);
	return Promise
		.bind(this)
		.then(function() {
			return bcrypt.compareAsync(password, this.get('password'));
		});
};

/**
 * Serializes this User
 * @return {Object} the serialized form of this User
 */
User.prototype.toJSON = function () {
	return _.omit(this.attributes, ['password']);
};

module.exports = bookshelf.model('User', User);
