const jwt = require('jsonwebtoken');
const fs = require('fs');

const { handler } = require('../../src/handlers/authorizer');
const publicKey = fs.readFileSync('./certificates/jwt-public.key');
const privateKey = fs.readFileSync('./certificates/jwt-private.key');
const invalidKey = fs.readFileSync('./__tests__/utils/jwt-private-invalid.key');

const data = { email: 'test@email.com' };
const options = { algorithm: 'RS512' };

const validToken = jwt.sign(data, privateKey, options);
// const invalidSecretToken = jwt.sign(data, invalidKey, options)

describe('Authorizer', () => {
  it('should successfully authenticate if JWT passed is signed correctly', async () => {
    const event = { authorizationToken: validToken, methodArn: 'testArn' };

    const expectedStatement = [
      {
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: event.methodArn,
      },
    ];
    const callback = jest.fn((err, policy) => {
      err, policy;
    });

    handler(event, null, callback);

    const { calls } = callback.mock;
    const [err, { principalId, policyDocument }] = calls[0];

    expect(calls.length).toBe(1);
    expect(err).toBeNull(); // Error to be Null

    expect(principalId).toBeDefined();
    expect(policyDocument).toBeDefined();
    expect(policyDocument.Statement).toStrictEqual(expectedStatement);
  });
});
