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
    console.log('DECODED', decodedToken);
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
  var authResponse = {};

  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    stringKey: 'stringval',
    numberKey: 123,
    booleanKey: true,
  };
  return authResponse;
}
