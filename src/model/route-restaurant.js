'use strict';

const logger = require('../lib/logger');
const Restaurant = require('../model/restaurant');
const storage = require('../lib/storage');
const response = require('../lib/response');

module.exports = function routeRestaurant(router) {
  // POST a restaurant
  router.post('/api/v1/restaurant', (req, res) => {
    try {
      const newRestaurant = new Restaurant(req.body.name, req.body.cuisine, req.body.location);
      // Promise initiated here with storage.create
      storage.create('Restaurant', newRestaurant)
        .then((restaurant) => {
          response.sendJSON(res, 201, restaurant);
          return undefined;
        });
    } catch (err) {
      logger.log(logger.ERROR, `ROUTE-RESTAURANT: There was a bad request ${err}`);
      response.sendText(res, 400, err.message);
      return undefined;
    }
    return undefined;
  });

  // GET one restaurant
  router.get('/api/v1/restaurant', (req, res) => {
    logger.log(logger.INFO, `RESTAURANT ROUTE: GET /api/v1/restaurant - ${JSON.stringify(res.body)}`);

    if (!req.url.query.id) {
      response.sendText(res, 404, 'Your request requires an id');
      return undefined;
    }

    storage.fetchOne('Restaurant', req.url.query.id)
      .then((item) => {
        response.sendJSON(res, 200, item);
        return undefined;
      })
      .catch((err) => {
        logger.log(logger.ERROR, err, JSON.stringify(err));
        response.sendText(res, 404, 'Resource not found');
        return undefined;
      });
    return undefined;  
  });

  // GET all restaurants
  router.get('/api/v1/restaurants', (req, res) => {
    logger.log(logger.INFO, 'RESTAURANT ROUTE: GET all /api/v1/restaurants');

    storage.fetchAll('Restaurant', req.body)
      .then((items) => {
        response.sendJSON(res, 200, items);
        return undefined;
      })
      .catch((err) => {
        logger.log(logger.ERROR, err, JSON.stringify(err));
        response.sendText(res, 404, 'Resources not found - Request for all restaurants');
        return undefined;
      });
    return undefined;  
  });

  // // PUT - update restaurant
  router.put('/api/v1/restaurant', (req, res) => {
    logger.log(logger.INFO, 'RESTAURANT ROUTE: Update /api/v1/restaurant');

    try {
      const newRestaurant = new Restaurant(
        req.body.name, 
        req.body.cuisine, 
        req.body.location, 
        req.body.id,
      );
      storage.update('Restaurant', newRestaurant)
        .then((restaurant) => {
          response.JSON(res, 201, restaurant);
          return undefined;
        });
    } catch (err) {
      logger.log(logger.ERROR, `ROUTE-RESTAURANT: There was a bad request ${err}`);
      response.sendText(res, 400, 'Bad request - 1 - route-restaurant POST');
      return undefined;
    }
    return undefined;
  });

  // DELETE restaurant
  router.delete('/api/v1/restaurant', (req, res) => {
    logger.log(logger.INFO, 'RESTAURANT ROUTE: DELETE /api/v1/restaurant');

    if (!req.url.query.id) {
      response.sendText(res, 404, 'Your DELETE request requires an id');
      return undefined;
    }

    storage.delete('Restaurant', req.url.query.id)
      .then(() => {
        response.sendText(res, 204, 'The restaurant has been deleted');
        return undefined;
      })
      .catch((err) => {
        logger.log(logger.ERROR, `DELETE catch: There was a bad request ${err}`);
        response.sendText(res, 400, 'Bad request - route-restaurant DELETE');
        return undefined;
      });
    return undefined;
  });
};
