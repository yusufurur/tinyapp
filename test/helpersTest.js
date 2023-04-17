const { assert } = require('chai');

const { findUserByEmail } = require('../helpers.js');
const { generateRandomString } = require('../helpers');
const { authenticateUser } = require('../helpers');
const { urlsForUser } = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "lighthouse123"
  },
  "user2RandomID": {
    id: "userRandomID2",
    email: "user2@example.com",
    password: "lighthouselabs2023"
  }
}

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};
describe('findUserByEmail', function () {
  it('should return a user with valid email', function () {
    const user = findUserByEmail("user@example.com", testUsers);
    const expectedOutput = testUsers["userRandomID"];

    assert.equal(user, expectedOutput);
  });
  it('should return undefined with a non existing email', function () {
    const user = findUserByEmail("userdoesnotexist@example.com", testUsers);
    const expectedOutput = undefined;

    assert.equal(user, expectedOutput);
  });
});

describe('generateRandomString', function () {
  it('should return a length of 6 characters', function () {
    const user = generateRandomString().length;
    const expectedOutput = 6;

    assert.equal(user, expectedOutput);
  });

});

describe('authenticateUser', function () {
  it('should return true if an email exists', function () {
    const user = authenticateUser('user@example.com', testUsers);
    const expectedOutput = true;

    assert.equal(user, expectedOutput);
  });
  it('should return false if an email does not exist', function () {
    const user = authenticateUser('user2@example.com', testUsers);
    const expectedOutput = true;

    assert.equal(user, expectedOutput);
  });

});

describe('urlsForUser', function () {
  it('should return urls for a specified user', function () {
    const user = urlsForUser(urlDatabase, 'aJ48lW');
    const expectedOutput = { b6UTxQ: 'https://www.tsn.ca', i3BoGr: 'https://www.google.ca' }

    assert.deepEqual(user, expectedOutput);
  });
  it('should return an empty object if an user does not exist', function () {
    const user = urlsForUser(urlDatabase, 'user2@example.com');
    const expectedOutput = {};
    assert.deepEqual(user, expectedOutput);
  });

});