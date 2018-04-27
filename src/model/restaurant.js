'use strict';

const uuid = require('uuid/v4');
const logger = require('../lib/logger');

module.exports = class {
  constructor(name, cuisine, location) {
    if (!name || !cuisine || !location) throw new Error('POST request requires title and content');
    this.name = name;
    this.cuisine = cuisine;
    this.location = location;
    this.id = uuid();
    logger.log(logger.INFO, `Restaurant: created a new restaurant ${JSON.stringify(this)}`);
  }
};
