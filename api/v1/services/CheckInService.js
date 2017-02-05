var CheckitError = require('checkit').Error;
var _Promise = require('bluebird');
var _ = require('lodash');

var CheckIn = require('../models/CheckIn');
var UserService = require('../services/UserService');
var errors = require('../errors');
var utils = require('../utils');


/**
 * Helper method to deal with boolean flags that should throw errors if requested to be set
 * to true if already true
 * @param {CheckIn} checkin to be updated
 * @param {Object} attributes attributes from request
 * @param {String} key name of boolean flag
 * @param {boolean} time if true, update checkin's time
 * @returns {CheckIn} checkin updated checkin
 * @private
 */
_updateFlag = function (checkin, attributes, key, time){

    var update = {};
    if(!checkin.get(key)){
        if (attributes[key] == true){
            update[key] = true;
            if (time){
                update['time'] = utils.time.sqlTime();
            }
        }
    }else{
        if (attributes[key] == true){
            var message = key + " is already true";
            var source = key;
            throw new errors.InvalidParameterError(message, source);
        }else if (attributes[key] == false){
            update[key] = false;
        }
    }
    checkin.set(update);

    return checkin;
}

/**
 * Finds a CheckIn by User ID
 * @param {Number} userId id of requested user
 * @returns {Promise} the resolved CheckIn for the user
 * @throws {NotFoundError} when the user has no check in
 */
module.exports.findCheckInByUserId = function (userId){
    return CheckIn
        .findByUserId(userId)
        .then(function (checkin){
            if (_.isNull(checkin)) {
                var message = "A check in record cannot be found for the given user";
                var source = "userId";
                throw new errors.NotFoundError(message, source);
            }

            return _Promise.resolve(checkin);
        })
        .catch(function(error){
            return _Promise.reject(error);
        })
};

/**
 * Updates portions of the checkin that are included
 * @param {CheckIn} the CheckIn to update
 * @param {Obejct} attributes the new CheckIn data to set
 * @returns {Promise} the resolved CheckIn for the user
 */
module.exports.updateCheckIn = function (checkin, attributes){

    checkin = _updateFlag(checkin, attributes, 'checkedIn', true);
    checkin = _updateFlag(checkin, attributes, 'swag', false);
    if (attributes.location){
        checkin.set({'location': attributes.location})
    }
    return checkin
        .validate()
        .catch(CheckitError, utils.errors.handleValidationError)
        .then(function (validated){
            return checkin.save();
        });

};

/**
 * Creates a CheckIn object for given user with the given attributes
 * @param {Number} id user id
 * @param {Object} attributes values requested
 * @returns {Promise} resolving to CheckIn object
 */
module.exports.createCheckIn = function (id, attributes){

    return CheckIn.findByUserId(id)
        .then(function (checkin){
            if (!_.isNull(checkin)) {
                var message = "A check in record already exists for this user";
                var source = "userId";
                throw new errors.InvalidParameterError(message, source);
            }
            return UserService.findUserById(id)
                .then(function (user){
                    var checkin = CheckIn.forge({ userId: id, checkedIn: false, location: "DCL", swag: false});
                    return checkin.save()
                        .then(function(ci){
                            return module.exports.updateCheckIn(ci, attributes);
                        });
                })
                .catch(function (error){
                    throw error;
                });
        })
        .catch(function (error) {
            throw error;
        });
};
