const { JsonWebTokenError } = require('jsonwebtoken');

const { verify } = require('../utils/jwt');
const { getConnection } = require('../utils/authorizer-connector');

let conn;

const Profile = require('../models/profile');

module.exports.handler = async (event, context) => {
  try {
    conn = await getConnection(conn, context);

    return new Promise((resolve, reject) => {
      const authValue = event.authorizationToken;
      if (!authValue)
        return reject(new Error('Unauthorized: Token not informed'));

      const splitted = authValue.split(' ');

      if (
        splitted[0] !== 'Bearer' ||
        !splitted[1] ||
        [null, undefined, ''].includes(splitted[1])
      ) {
        return reject(new Error('Unauthorized: Token not informed'));
      }

      const [, token] = splitted;

      verify(token)
        .then((decoded) => {
          if (decoded instanceof JsonWebTokenError) {
            console.error('JWT error', decoded);
            throw new Error('Unauthorized: Malformed Token');
          }
          const { id } = decoded;
          return Profile.findOne({ _id: id }).exec();
        })
        .then((profile) => {
          console.log('profile', profile);
          if (profile) {
            return resolve(generatePolicy('user', 'Allow', event.methodArn), {
              profile,
            });
          }

          resolve(generatePolicy('user', 'Deny', event.methodArn));
        })
        .catch((error) => {
          console.error('ERROR', error);
          reject(error);
        });
    });
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      // body: JSON.stringify({ message: e.message })
    };
  }
};

function generatePolicy(principalId, effect, resource, context) {
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

  if (context) {
    authResponse.context = context;
  }
  return authResponse;
}
