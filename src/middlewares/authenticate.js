const Profile = require('../models/profile');
const { NotPermittedError } = require('common-errors');

module.exports = (req, res, next) => {
  console.log('Authenticating ...', req.requestContext.authorizer);
  const { principalId } = req.requestContext.authorizer;

  console.log('trying to find profile ...');
  Profile.findOne({ _id: principalId })
    .then((profile) => {
      console.log('profile was found? ', profile);
      if (!profile) {
        console.error(`Profile not found for id '${principalId}'`);
        return next(new NotPermittedError('Forbidden operation'));
      }
      console.log('trying to add to request');
      req.auth = profile;
      console.log('added to request', req.auth);
      next();
    })
    .catch((error) => {
      console.error('Unknown Error', error);
      next(error);
    });
};
