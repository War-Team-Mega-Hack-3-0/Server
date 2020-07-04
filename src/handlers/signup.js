'use strict';
const { MongoError } = require('mongodb');

const app = require('../app');
const handler = require('../handler');
const { sign } = require('../utils/jwt');
const { AlreadyInUseError } = require('common-errors');

const Profile = require('../models/profile');

const DatabaseConnector = require('../middlewares/database-connector');

app.use(DatabaseConnector());

app.post('/profile/signup', async (req, res, next) => {
  const { email, password } = req.body;

  try {
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

module.exports.handler = handler(app);
