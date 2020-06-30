const { createCipheriv, createDecipheriv } = require('crypto');
const { Buffer } = require('buffer');

const algorithm = 'aes-256-ctr';
const i = 'utf8';
const o = 'hex';
const k = process.env.ENCRIPT_KEY;
const encryptIv = process.env.ENCRIPT_IV;
const iv = Buffer.from(encryptIv);

module.exports.encrypt = (value) => {
  const cipher = createCipheriv(algorithm, k, iv);
  let crypted = cipher.update(value, i, o);
  crypted += cipher.final(o);
  return `${iv.toString(o)}:${crypted.toString()}`;
};

module.exports.decrypt = (encrypted) => {
  const decipher = createDecipheriv(algorithm, k, iv);
  let decrypted = decipher.update(encrypted, i, o);
  decrypted += decipher.final(o);
  return decrypted;
};
