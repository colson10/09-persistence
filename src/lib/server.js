'use strict';

const http = require('http');
const logger = require('./logger');

// Router setup
const Router = require('./router');

const router = new Router();
require('../model/route-restaurant')(router);

console.log(router, 'ROUTER IN SERVER');

// application setup goes here
// anonymous
const app = http.createServer(router.route());

const server = module.exports = {};
server.start = (port, callback) => app.listen(port, callback);
server.stop = callback => app.close(callback);
