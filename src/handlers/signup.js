'use strict';
const { MongoError } = require('mongodb');

const app = require('../app');
const handler = require('../handler');
const { sign } = require('../utils/jwt');
const { AlreadyInUseError, ValidationError } = require('common-errors');

const Profile = require('../models/profile');

const DatabaseConnector = require('../middlewares/database-connector');

module.exports.handler = ((connector = DatabaseConnector) => {
  app.use(connector());

  app.post('/profile/signup', async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError());
    }

    try {
      const profiles = await Profile.find({});
      const profileInDatabase = await Profile.findOne({ email });

      console.log('PROFILE DATABASE', profileInDatabase);
      console.log('PROFILES in DATABASE', profiles);

      if (profileInDatabase !== null) {
        return next(new AlreadyInUseError());
      }

      const profile = await Profile.create({
        email,
        password,
      });

      if (profile) {
        const token = sign({ id: profile._id });
        return res.status(200).json({ data: profile, meta: { token } });
      }
      console.error('Profile cant be created: ', profile);
      res.status(500).send();
    } catch (error) {
      console.error('ERROR', error);
      if (
        error instanceof MongoError &&
        error.message.search('duplicate key error') >= 0
      ) {
        return next(new AlreadyInUseError());
      }

      console.error('Error while signup profile', error);
      res.status(500).send();
    }
  });

  return handler(app);
})();

// module.exports.handler = handler(app);
