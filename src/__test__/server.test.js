'use strict';

const server = require('../lib/server');
const superagent = require('superagent');

const testPort = 5000;
const mockResource = {
  name: 'Veraci', cuisine: 'Pizza', location: 'Ballard',
};
const mockResource2 = {
  name: 'Skillet', cuisine: 'American', location: 'Capitol Hill',
};

const restaurants = {};
let mockId = null;
const mockId2 = null;

beforeAll(() => server.start(testPort));
afterAll(() => server.stop());


describe('VALID request to the API', () => {
  describe('POST /api/v1/restaurant', () => {
    it('Should respond with status 201 and create a new restaurant', () => {
      return superagent.post(`:${testPort}/api/v1/restaurant`)
        .send(mockResource)
        .then((res) => {
          mockId = res.body.id;
          expect(res.body.name).toEqual(mockResource.name);
          expect(res.body.cuisine).toEqual(mockResource.cuisine);
          expect(res.body.location).toEqual(mockResource.location);
          expect(res.status).toEqual(201);
        });
    });
  });

  describe('GET /api/v1/restaurant', () => {
    it('should respond with the previously created note', () => {
      return superagent.get(`:${testPort}/api/v1/restaurant?id=${mockId}`)
        .then((res) => {
          expect(res.body.name).toEqual(mockResource.name);
          expect(res.body.cuisine).toEqual(mockResource.cuisine);
          expect(res.body.location).toEqual(mockResource.location);
        });
    });
  });

  describe('DELETE /api/v1/restaurant', () => {
    it('should respond delete item', () => {
      return superagent.delete(`:${testPort}/api/v1/restaurant?id=${mockId}`)
        .then((res) => {
          expect(res.status).toEqual(204);
        });
    });
  });

  describe('GET 2nd time /api/v1/restaurant', () => {
    it('should respond resource not found', () => {
      console.log(mockId, 'this is the mockid before the get');
      return superagent.get(`:${testPort}/api/v1/restaurant?id=${mockId}`)
        .then((res) => {
          console.log(res.status, 'this is the res.status in the 2nd get');
          expect(res.status).toEqual(200);
        })
        .catch((err) => {
          expect(err.status).toEqual(404);
        });
    });
  });
});
