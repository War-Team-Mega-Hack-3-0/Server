const { JsonWebTokenError } = require('jsonwebtoken');
const { verify } = require('../utils/jwt');
const Profile = require('../models/profile');

module.exports.handler = async (
  event,
  context,
  callback,
  profileModel = Profile
) => {
  const authValue = event.authorizationToken;

  if (!authValue) throw new Error('Unauthorized: Token not informed');

  const token = authValue.match(
    /[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
  )[0];

  try {
    const decoded = await verify(token);
    if (decoded instanceof JsonWebTokenError) {
      console.error('JWT error', decoded);
      throw new Error('Unauthorized: Malformed Token');
    }
    const { id } = decoded;
    const profile = await profileModel.findById(id);

    if (profile) {
      console.log('PROFILE', profile);
      return generatePolicy(profile._id, 'Allow', event.methodArn);
    }

    return generatePolicy(null, 'Deny', event.methodArn);
  } catch (error) {
    console.error('Error on Authorizer', error);
    throw error;
  }
};

function generatePolicy(principalId, effect, resource) {
  const authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {
      Statement: [],
    };
    policyDocument.Version = '2012-10-17';
    const statementOne = {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource,
    };

    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
}
