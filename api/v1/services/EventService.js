const _Promise = require('bluebird');
const _ = require('lodash');

const utils = require('../utils');
const Location = require('../models/Location');
const Event = require('../models/Event');
const EventLocation = require('../models/EventLocation');
const EventFavorite = require('../models/EventFavorite');

const errors = require('../errors');

const cache = utils.cache;

const EVENT_FAVORITES_CACHE_KEY = 'eventfavorites';

module.exports.getAllLocations = () => Location.fetchAll();

module.exports.createLocation = (params) => {
  const location = Location.forge(params);

  return location.save()
    .catch(
      utils.errors.DuplicateEntryError,
      utils.errors.handleDuplicateEntryError('A location with the given name already exists', 'name')
    );
};

module.exports.getEvents = (getActive) => {
  if (getActive) {
    return Event.query((qb) => {
      qb.whereRaw('end_time > current_time()')
          .andWhereRaw('start_time < current_time()');
    })
      .fetchAll({
        withRelated: [ 'locations' ]
      });
  }
  return Event.fetchAll({
    withRelated: [ 'locations' ]
  });

};

module.exports.createEvent = (params) => {
  const event = params.event;
  event.startTime = utils.time.convertISOTimeToMySQLTime(event.startTime);
  event.endTime = utils.time.convertISOTimeToMySQLTime(event.endTime);
  const locations = params.eventLocations;

  return Event.transaction((t) => new Event(event)
      .save(null, {
        transacting: t
      })
      .then((result) => {
        if (locations) {
          return _Promise.map(locations, (location) => {
            location.eventId = result.id;
            return new EventLocation(location)
                .save(null, {
                  transacting: t
                });
          })
            .then((locationResult) => ({
              'event': result,
              'eventLocations': locationResult
            }));
        }
        return {
          'event': result
        };

      }))
    .catch(
      utils.errors.DuplicateEntryError,
      utils.errors.handleDuplicateEntryError('An event with the given name already exists', 'name')
    );
};

module.exports.deleteEvent = (params) => Event.findByName(params.name).then((model) => {
  if (_.isNull(model)) {
    const message = 'An event with the given name does not exist';
    const source = 'name';
    throw new errors.InvalidParameterError(message, source);
  }
  model.related('locations').forEach((location) => location.destroy());
  return model.destroy();
});

function _writeToCache(userId) {
  return EventFavorite.findByUserId(userId).then((models) => cache.storeString(EVENT_FAVORITES_CACHE_KEY + userId, JSON.stringify(models.toJSON())));
}

module.exports.createEventFavorite = (userId, params) => {
  params.userId = userId;
  const eventFavorite = EventFavorite.forge(params);

  return eventFavorite.save()
    .catch(
      utils.errors.DuplicateEntryError,
      utils.errors.handleDuplicateEntryError('A event favorite with the given event id already exists', 'eventId')
    )
    .catch((error) => error.code === 'ER_NO_REFERENCED_ROW_2', () => {
      const message = 'An event with the given event id does not exist';
      const source = 'eventId';
      throw new errors.InvalidParameterError(message, source);
    })
    .then((model) => _writeToCache(userId).then(() => model));
};

module.exports.getEventFavorites = (userId) => cache.hasKey(EVENT_FAVORITES_CACHE_KEY + userId).then((hasKey) => {
  if(hasKey) {
    return cache.getString(EVENT_FAVORITES_CACHE_KEY + userId)
          .then((object) => JSON.parse(object));
  } 
  return EventFavorite.findByUserId(userId).then((models) => _writeToCache(userId).then(() => models.toJSON()));
    
});

module.exports.deleteEventFavorite = (userId, params) => EventFavorite.findByUserFavoriteEvent(userId, params.eventId)
    .then((model) => {
      if(_.isNull(model)) {
        const message = 'An event favorite with the given event id does not exist';
        const source = 'eventId';
        throw new errors.InvalidParameterError(message, source);
      }
      return model.destroy().then((model) => _writeToCache(userId).then(() => model));
    });
