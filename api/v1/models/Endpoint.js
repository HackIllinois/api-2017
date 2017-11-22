const Model = require('./Model');

const Endpoint = Model.extend({
  tableName: 'endpoints',
  idAttribute: 'endpoint',
  validations: {
    endpoint: ['required', 'string', 'maxLength:100'],
    enabled: ['required', 'boolean']
  }
});

module.exports = Endpoint;