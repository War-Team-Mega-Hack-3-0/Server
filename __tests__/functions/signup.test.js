const request = require('supertest');
const { handler } = require('../../src/handlers/signup');

const Profile = require('../../src/models/profile');

const data = {
  email: 'test@email.com',
  password: '12332112312',
};

describe('Signup', () => {
  describe('/profile/signup', () => {
    //TODO: fix the test for creation. It gets timed out if I try to delete all the records
    // it('should signup the profile successfully', async () => {

    //   const res = await request(handler).post('/profile/signup').send(data);

    //   expect(res.statusCode).toBe(200);
    //   expect(Object.keys(res.body).sort()).toStrictEqual(
    //     ['data', 'meta'].sort()
    //   );
    //   expect(res.body.data._id).toBeDefined();
    //   expect(res.body.meta.token).toBeDefined();
    // });

    it('should not signup the profile with conflicted email', async () => {
      let profiles = await Profile.find({});
      console.log('PROFILES in test', profiles);
      expect(profiles.length).toBe(1);
      expect(profiles[0].email).toBe(data.email);

      const res = await request(handler).post('/profile/signup').send(data);

      profiles = await Profile.find();
      expect(profiles.length).toBe(1);
      expect(res.statusCode).toBe(409);
    });
  });
});
