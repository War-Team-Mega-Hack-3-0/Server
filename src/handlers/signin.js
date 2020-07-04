'use strict';
const bcrypt = require('bcrypt');

const app = require('../app');
const handler = require('../handler');
const { sign } = require('../utils/jwt');
const authenticate = require('../middlewares/authenticate');
const { AuthenticationRequiredError } = require('common-errors');

const Profile = require('../models/profile');

const DatabaseConnector = require('../middlewares/database-connector');

app.use(DatabaseConnector());

app.post('/profile/token', authenticate, async (req, res, next) => {
  const { email, password } = req.body;
  const error = new AuthenticationRequiredError('Invalid Credentials');
  try {
    const profile = await Profile.findOne({
      email,
    });

    if (!profile) {
      next(error);
    }

    const passwordMatches = await bcrypt.compare(password, profile.password);

    if (!passwordMatches) {
      next(error);
    }

    const token = sign({ id: profile._id });
    return res.status(200).json({ auth: true, token });
  } catch (error) {
    res.status(401).json({ auth: false });
  }
});

module.exports.handler = handler(app);
