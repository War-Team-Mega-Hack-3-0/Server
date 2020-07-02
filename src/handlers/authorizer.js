const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports.handler = (event, context, callback) => {
  const authValue = event.authorizationToken;

  if (!authValue) return callback('Unauthorized: Token not informed');

  const token = authValue.match(
    /[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
  )[0];

  try {
    const publicKey = fs.readFileSync('./certificates/jwt-public.key');
    const decodedToken = jwt.verify(token, publicKey, {
      algorithms: ['RS512'],
    });

    const { email } = decodedToken;

    if (email) {
      return callback(null, generatePolicy('user', 'Allow', event.methodArn));
    }

    callback(null, generatePolicy('user', 'Deny', event.methodArn));
  } catch (error) {
    callback('Invalid Token');
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
