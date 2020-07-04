const fs = require('fs');
const { sign, verify } = require('jsonwebtoken');

module.exports.sign = (data) => {
  const privateKey = fs.readFileSync('./certificates/jwt-private.key', 'utf8');
  const token = sign(data, privateKey, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
    algorithm: process.env.TOKEN_ALGORITHM,
  });

  return token;
};

module.exports.verify = async (encoded) => {
  const publicKey = fs.readFileSync('./certificates/jwt-public.key', 'utf8');

  try {
    const response = verify(encoded, publicKey, {
      algorithms: [process.env.TOKEN_ALGORITHM],
    });
    return response;
  } catch (error) {
    return error;
  }
};
