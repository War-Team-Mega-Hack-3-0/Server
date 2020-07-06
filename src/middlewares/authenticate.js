const Profile = require('../models/profile');
const { NotPermittedError } = require('common-errors');

module.exports = (req, res, next) => {
  const { principalId } = req.requestContext.authorizer;

  Profile.findOne({ _id: principalId })
    .then((profile) => {
      if (!profile) {
        console.error(`Profile not found for id '${principalId}'`);
        return next(new NotPermittedError('Forbidden operation'));
      }
      req.auth = profile;
      next();
    })
    .catch((error) => {
      console.error('Unknown Error', error);
      next(error);
    });
};
