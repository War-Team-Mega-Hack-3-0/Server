const mongoose = require('mongoose');
const { MongoError } = require('mongodb');
const bcrypt = require('bcrypt');

const Profile = require('../../src/models/profile');
const { getMongoMemoryServer } = require('../../src/utils/mongo-server');
const { decrypt } = require('../../src/utils/encrypter');

const profileData = {
  email: 'profile@email.com',
  password: 'supersecurepassword',
  integrations: [],
};

describe('Profile - Model', () => {
  beforeAll(async () => {
    const { uri } = await getMongoMemoryServer();
    await mongoose.connect(uri, {
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
    expect(saved.integrations.length).toBe(profileData.integrations.length);
    expect(
      await bcrypt.compare(profileData.password, saved.password)
    ).toBeTruthy();
  });

  it('should create and save successfully, but attributes not in the schema should be undefined', async () => {
    const data = {
      ...profileData,
      email: 'profile2@email.com',
      invalidAttribute: 'invalid',
    };

    const almostValidProfile = new Profile(data);
    const saved = await almostValidProfile.save();

    expect(saved._id).toBeDefined();
    expect(saved.email).toBe(data.email);
    expect(saved.invalidAttribute).toBeUndefined();
  });

  it('should fail to create if email is not unique', async () => {
    const invalidProfile = new Profile(profileData); //duplicated email
    let err;

    try {
      const savingError = await invalidProfile.save();
      err = savingError;
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(MongoError);
    expect(err.message.search('E11000 duplicate key error')).not.toBe(-1);
  });

  it("should fail to create if email isn't passed as attribute", async () => {
    const { email, ...data } = profileData;
    const invalidProfile = new Profile(data); //duplicated email
    let err;

    try {
      const savingError = await invalidProfile.save();
      err = savingError;
    } catch (error) {
      err = error;
    }

    console.log(err);
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });

  it('should encrypt correctly the integrations when passed', async () => {
    const data = {
      ...profileData,
      email: 'profile3@email.com',
      integrations: [{ kind: 'VTEX', key: 'key', code: 'code' }],
    };
    const profile = new Profile(data);

    const saved = await profile.save();

    expect(decrypt(saved.integrations[0].key)).toBe(data.integrations[0].key);
    expect(decrypt(saved.integrations[0].code)).toBe(data.integrations[0].code);
  });
});
