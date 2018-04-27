'use strict';

// TODO: refactor to use bluebird. the const memory object will not be used.

const logger = require('./logger');
const storage = module.exports = {};
// const Promise = require('bluebird');
// const fs = Promise.promisifyAll(require('fs'), { suffix: 'Prom' });\
const memory = {};

storage.create = function create(schema, item) {
  logger.log(logger.INFO, 'Creating log');
  return new Promise((resolve, reject) => {
    if (!schema) return reject(new Error('Cannot create a new item, schema required'));
    if (!item) return reject(new Error('Cannot create a new item, item required'));

    if (!memory[schema]) memory[schema] = {};
    memory[schema][item.id] = item;
    return resolve(item);
  });
};

storage.fetchOne = function fetchOne(schema, id) {
  return new Promise((resolve, reject) => {
    if (!schema) return reject(new Error('expected schema name'));
    if (!id) return reject(new Error('expected id'));
    if (!memory[schema]) return reject(new Error('schema not found'));
    const item = memory[schema][id];

    if (!item) {
      return reject(new Error('item not found'));
    }
    return resolve(item);
  });
};

storage.fetchAll = function fetchAll(schema) {
  return new Promise((resolve, reject) => {
    if (!schema) return reject(new Error('No restaurants in schema'));
    const items = memory[schema];
    return resolve(items);
  });
};

storage.update = function update(schema, item) {
  logger.log(logger.INFO, 'Updating restaurant');
  return new Promise((resolve, reject) => {
    if (!item) return reject(new Error('Cannot update item, item required'));

    memory[schema][item.id] = item;
    return resolve(item);
  });
};

storage.delete = function del(schema, id) {
  return new Promise((resolve, reject) => {
    if (!schema || !id) return reject(new Error('No restaurant to delete.'));
    const item = memory[schema][id];
    delete memory[schema];
    if (!item) {
      return reject(new Error('item not found'));
    }
    return resolve(item);
  });
};
