const request = require('supertest');
const { handler } = require('../../src/handlers/hello');

describe('hello', () => {
  it('should return the serverless message', async () => {
    const res = await request(handler).get('/');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
