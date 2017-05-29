var _ = require('lodash');

var CheckIn = require('../models/CheckIn');
var NetworkCredential = require('../models/NetworkCredential');
var errors = require('../errors');
var utils = require('../utils');


/**
 * Finds a CheckIn by User ID
 * @param {Number} userId id of requested user
 * @returns {Promise} the resolving to obect {checkin: {CheckIn object}, credentials: {Credential object}}
 * @throws {NotFoundError} when the user has no check in
 */
module.exports.findCheckInByUserId = function(userId) {
	return CheckIn
    .findByUserId(userId)
    .then(function(checkin) {
	if (_.isNull(checkin)) {
		var message = 'A check in record cannot be found for the given user';
		var source = 'userId';
		throw new errors.NotFoundError(message, source);
	}
	return NetworkCredential.findByUserId(userId)
        .then(function(credentials) {
	return {
		'checkin': checkin,
		'credentials': credentials
	};
});
});
};

/**
 * Updates the CheckIn values to request
 * @param {Obejct} attributes to be updated
 * @returns {Promise} the resolved obect {checkin: {CheckIn object}}
 */
module.exports.updateCheckIn = function(attributes) {
	return module.exports.findCheckInByUserId(attributes.userId)

    .then(function(checkin) {
	checkin = checkin.checkin;
	var updates = {
		'swag': attributes.swag || checkin.get('swag'),
		'location': attributes.location || checkin.get('location')
	};
	checkin.set(updates, {
		patch: true
	});
	return checkin.save()
        .then(function(model) {
	return NetworkCredential.findByUserId(attributes.userId)
            .then(function(credentials) {
	return {
		'checkin': model,
		'credentials': credentials
	};
});
});
});
};

/**
 * Creates a CheckIn object for given user with the given attributes
 * @param {Object} attribute values requested
 * @returns {Promise} resolving to obect {checkin: {CheckIn object}, credentials: {Credential object}}
 * @throws {InvalidParameterError} when the user has already checked in
 */
module.exports.createCheckIn = function(attributes) {
	var credentialsRequested = attributes.credentialsRequested;
	delete attributes.credentialsRequested;

	return CheckIn.transaction(function(t) {
		return new CheckIn(attributes)
        .save(null, {
	transacting: t
})
        .then(function(model) {
	if (credentialsRequested) {
		return NetworkCredential.findUnassigned();
	} else {
		return model;
	}
})
        .then(function(model) {
	if (credentialsRequested) {
		if (_.isNull(model)) {
			var message = 'There are no remaining unassigned network credentials';
			var source = 'NetworkCredential';
			throw new errors.UnprocessableRequestError(message, source);
		}

		var updates = {
			'userId': attributes.userId,
			'assigned': true
		};
		model.set(updates, {
			patch: true
		});

		return model.save(null, {
			transacting: t
		})
              .then(function(creds) {
	return {
		'checkin': model,
		'credentials': creds
	};
});
	} else {
		return {
			'checkin': model
		};
	}
});
	})
    .catch(
      utils.errors.DuplicateEntryError,
      utils.errors.handleDuplicateEntryError('The user is already checked in', 'userId')
    );
};
