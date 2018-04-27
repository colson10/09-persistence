'use strict';

// TODO: refactor to use bluebird. the const memory object will not be used.

const logger = require('./logger');

const storage = module.exports = {};
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'), { suffix: 'Prom' });
// const memory = {};

storage.create = function create(schema, item) {
  logger.log(logger.INFO, 'Creating log');
  if (!schema) return Promise.reject(new Error('Cannot create a new item, schema required'));
  if (!item) return Promise.reject(new Error('Cannot create a new item, item required'));

  const json = JSON.stringify(item);
  // console.log(item, schema);
  // console.log(__dirname);
  return fs.writeFileProm(`${__dirname}/../data/${schema}/${item.id}.json`, json)
    .then(() => {
      logger.log(logger.INFO, 'STORAGE: Created a new resource');
      return item;
    })
    .catch(err => Promise.reject(err));
};

storage.fetchOne = function fetchOne(schema, id) {
  if (!schema) return Promise.reject(new Error('expected schema name'));
  if (!id) return Promise.reject(new Error('expected id'));

  return fs.readFileProm(`${__dirname}/../data/${schema}/${id}.json`)
    .then((data) => {
      try {
        const item = JSON.parse(data.toString());
        return item;
      } catch (err) {
        return Promise.reject(err);
      }
    })
    .catch((err) => {
      logger.log(logger.ERROR, JSON.stringify(err));
    });
};

storage.fetchAll = function fetchAll(schema) {
  if (!schema) return Promise.reject(new Error('No restaurants in schema'));

  return fs.readFileProm(`${__dirname}/..data/${schema}.json`)
    .then((data) => {
      try {
        const items = JSON.parse(data.toString());
        // const allItems = Object.values(memory[schema]);
        // const restaurants = allItems.map(rest => rest.id);
        return items;
      } catch (err) {
        return Promise.reject(err);
      }
    })
    .catch((err) => {
      logger.log(logger.ERROR, JSON.stringify(err));
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
