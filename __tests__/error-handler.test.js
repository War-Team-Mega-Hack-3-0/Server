const request = require('supertest');
const errors = require('common-errors');
const app = require('../src/app');

const handlerCreator = require('../src/handler');

let handler;
const errorsToTest = {
  ...errors.HttpStatusError.code_map,
  ArgumentNullError: 404,
};

function setRoutesToReturnError() {
  Object.keys(errorsToTest).map((errorName) => {
    app.get(`/${errorName}`, (req, res, next) => next(new errors[errorName]()));
  });

  app.get('/crash', () => {
    throw new Error('Internal Error');
  });

  return handlerCreator(app);
}

describe('error-handler', () => {
  beforeAll(() => {
    handler = setRoutesToReturnError();
  });

  Object.keys(errorsToTest).map((errorName) => {
    const status = errorsToTest[errorName];
    it(`should return error ${status} if ${errorName} is raised on the middleware route chain`, async () => {
      const res = await request(handler).get(`/${errorName}`);

      expect(res.statusCode).toEqual(status);
    });
  });

  it(`should crash safely`, async () => {
    const res = await request(handler).get(`/crash`);

    expect(res.statusCode).toEqual(500);
  });
});
