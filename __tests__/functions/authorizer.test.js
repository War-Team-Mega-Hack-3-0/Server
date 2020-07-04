const jwt = require('jsonwebtoken');
const fs = require('fs');

const { handler } = require('../../src/handlers/authorizer');

const privateKey = fs.readFileSync('./certificates/jwt-private.key');
const invalidKey = fs.readFileSync('./__tests__/utils/jwt-private-invalid.key');

const data = { id: '12332112312' };
const options = { algorithm: 'RS512' };

const validToken = jwt.sign(data, privateKey, options);
const invalidSecretToken = jwt.sign(data, invalidKey, options);

const mockModel = {
  findById: (id) => Promise.resolve({ _id: id }),
};

describe('Authorizer', () => {
  it('should successfully authorize if JWT passed is signed correctly', async () => {
    const event = { authorizationToken: validToken, methodArn: 'testArn' };

    const expectedStatement = [
      {
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: event.methodArn,
      },
    ];

    handler(
      event,
      null,
      (err, policy) => {
        const { principalId, policyDocument } = policy;

        expect(err).toBeNull(); // Error to be Null

        expect(principalId).toBeDefined();
        expect(policyDocument).toBeDefined();
        expect(policyDocument.Statement).toStrictEqual(expectedStatement);
      },
      mockModel
    );
  });

  it('should not authorize if JWT is signed with a different key (invalid token)', () => {
    const event = {
      authorizationToken: invalidSecretToken,
      methodArn: 'testArn',
    };

    handler(
      event,
      null,
      (err) => {
        expect(err).toBe('Invalid Token'); // Error to be Null
      },
      mockModel
    );
  });
});
