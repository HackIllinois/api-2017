const chai = require('chai');
chai.use(require('chai-as-promised'));

const mockery = require('mockery');
const mockknex = require('mock-knex');
const bookshelf = require('bookshelf');
function bookshelfMock (knex) {
  mockknex.mock(knex);
  return bookshelf(knex);
}

mockery.registerMock('bookshelf', bookshelfMock);
mockery.registerMock('redis', require('redis-mock'));

mockery.enable({ warnOnUnregistered: false });

require('./user.js');
require('./registration.js');
require('./auth.js');
require('./ecosystem.js');
require('./permission.js');
require('./token.js');
require('./storage.js');
require('./checkin.js');
require('./rsvp.js');

mockery.disable();
