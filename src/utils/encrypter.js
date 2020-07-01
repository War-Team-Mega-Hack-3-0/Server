const { createCipheriv, createDecipheriv } = require('crypto');
const { Buffer } = require('buffer');

const algorithm = 'aes-256-ctr';
const i = 'utf8';
const o = 'hex';
const k = process.env.ENCRYPT_KEY;
const encryptIv = process.env.ENCRYPT_IV;
const kString = k.slice(0, 32);

module.exports.encrypt = (value) => {
  const iv = Buffer.from(encryptIv);
  const ivString = iv.slice(0, 16);
  const cipher = createCipheriv(algorithm, kString, ivString);
  let crypted = cipher.update(value, i, o);
  crypted += cipher.final(o);
  return `${ivString.toString(o)}:${crypted.toString()}`;
};

module.exports.decrypt = (encrypted) => {
  const [, crypted] = encrypted.split(':');
  const ivString = Buffer.from(encryptIv).slice(0, 16);
  const decipher = createDecipheriv(algorithm, kString, ivString);
  let decrypted = decipher.update(crypted, o, i);
  decrypted += decipher.final(i);
  return decrypted;
};
