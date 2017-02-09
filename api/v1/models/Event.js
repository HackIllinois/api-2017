/* jshint esversion 6 */
var _Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');

var Model = require('./Model');
var Location_Events = require('./Location_Events');

var Event = Model.extend({
        tableName: 'events',
        idAttribute: 'id',
        hasTimestamps: ['created', 'updated'],
        validations: {
                name: ['required', 'string', 'maxLength:255'],
                short_name: ['required', 'string', 'maxLength:25'],
                description: ['required', 'string', 'maxLength:2047'],
                qr_code: ['required', 'boolean'],
                start_time: ['required', 'date'],
                end_time: ['required', 'date']
        },

        location_events: function () {
                return this.belongsToMany(Location_Events);
        }
});

/**
 * Finds a event by its ID, joining in its related roles
 * @param  {Number|String} id   the ID of the model with the appropriate type
 * @return {Promise<Model>}     a Promise resolving to the resulting model or null
 */
Event.findById = function(id) {
        return Event.where({ id: id });
};


/**
 * Finds all events that have been updated since the given timestamp.
 * @param {Number} unix_timestamp     the timestamp to fetch from
 * @return {Promise<Model>}           a Promise resolving to models since the timestamps
 */
Event.findByUpdated = function(unix_timestamp) {
        return Event.where('updated', '>=', moment.unix(unix_timestamp).toDate())
		.fetchAll();
};

/**
 * Creates a new event and locations with the specified parameters. Validation is performed on-save only
 * @param  {String}         name            The event's name
 * @param  {String}         short_name            The event's name
 * @param  {String}         description     The event's description
 * @param  {Number|Boolean} qr_code         Whether the event needs a QR code or not
 * @param  {Number}         start_time      Time at which the event takes place
 * @param  {Number}         end_time            Time at which the event takes place
 * @param  {[Location]}     locations       Array of Location objects. Containing three parameters:
 *                                                   name:      name of the location,
 *                                                   latitude:  latitude of the location,
 *                                                   longitude: longitude of the location,
 */
Event.create = function (name, short_name,
			 description, qr_code,
			 start_time, end_time, locations) {
        var event = Event.forge({
                name: name,
		short_name: short_name,
                description: description,
                qr_code: qr_code != 0,
		start_time: moment.unix(start_time).toDate(),
		end_time: moment.unix(end_time).toDate()
        });

        if (!locations || locations.length == 0) {
                return event.save();
        }

        return event.save();
};

Event.prototype.serialize = function () {
        var ret = _.omit(this.attributes, ['created']);
	ret.start_time	= ret.startTime.getTime() / 1000.0;
	ret.end_time	= ret.endTime.getTime() / 1000.0;
	ret.updated	= ret.updated.getTime() / 1000.0;
	return ret;
};

module.exports = Event;
