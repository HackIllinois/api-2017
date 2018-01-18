const Model = require('./Model');
const AttendeeExtraInfo = Model.extend({
  tableName: 'attendee_extra_infos',
  idAttribute: 'id',
  validations: {
    attendeeId: ['required', 'integer'],
    info: ['required', 'string', 'maxLength:255']
  }
});

AttendeeExtraInfo.findByAttendeeId = (attendeeId) => AttendeeExtraInfo.where({
  attendee_id: attendeeId
})
  .fetch();

AttendeeExtraInfo.findById = (id) => AttendeeExtraInfo.where({
  id: id
})
  .fetch();

module.exports = AttendeeExtraInfo;
