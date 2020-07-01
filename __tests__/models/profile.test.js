const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Profile = require('../../src/models/profile');

const profileData = {
  email: 'profile@email.com',
  password: 'supersecurepassword',
  integrations: [],
};

describe('Profile - Model', () => {
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      bufferCommands: false, // Disable mongoose buffering
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferMaxEntries: 0,
    });
  });
  it('should create and save successfully with valid data', async () => {
    const validProfile = new Profile(profileData);
    const saved = await validProfile.save();

    expect(saved._id).toBeDefined();
    expect(saved.email).toBe(profileData.email);
    expect(
      await bcrypt.compare(profileData.password, saved.password)
    ).toBeTruthy();
  });
});
