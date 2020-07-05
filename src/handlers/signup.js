'use strict';
const { MongoError } = require('mongodb');

const app = require('../app');
const handler = require('../handler');
const { sign } = require('../utils/jwt');
const { AlreadyInUseError, ValidationError } = require('common-errors');

const Profile = require('../models/profile');

const DatabaseConnector = require('../middlewares/database-connector');
let conn;

module.exports.handler = ((connector = DatabaseConnector) => {
  app.use(connector(conn));

  app.post('/profile/signup', async (req, res, next) => {
    const { email, password: passwd } = req.body;

    if (!email || !passwd) {
      return next(new ValidationError());
    }

    try {
      const profile = await Profile.create({
        email,
        password: passwd,
      });

      if (profile) {
        const token = sign({ id: profile._id });
        const { password, ...response } = profile._doc;
        return res.status(200).json({ data: response, meta: { token } });
      }
      console.error('Profile cant be created: ', profile);
      res.status(500).send();
    } catch (error) {
      console.error('ERROR', error);
      if (
        error instanceof MongoError &&
        error.message.search('duplicate key error') >= 0
      ) {
        return next(new AlreadyInUseError('profile', ['email']));
      }

      console.error('Error while signup profile', error);
      res.status(500).send();
    }
  });

  return handler(app);
})();
