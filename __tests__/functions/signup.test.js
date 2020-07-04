const request = require('supertest');
const { handler } = require('../../src/handlers/signup');

const data = {
  email: 'test@email.com',
  password: '12332112312',
};

describe('Signup', () => {
  describe('/profile/signup', () => {
    it('should signup the profile successfully', async () => {
      const res = await request(handler).post('/profile/signup').send(data);

      console.log(res.statusCode, res.body);
      expect(res.statusCode).toBe(200);
      expect(Object.keys(res.body).sort()).toStrictEqual(
        ['data', 'meta'].sort()
      );
      expect(res.body.data._id).toBeDefined();
      expect(res.body.meta.token).toBeDefined();
    });
  });
});
