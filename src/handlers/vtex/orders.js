const { vtexRequest } = require('../../utils/vtex-request');
const { ArgumentNullError } = require('common-errors');
const { decrypt } = require('../../utils/encrypter');

module.exports.handler = async (event) => {
  console.log('INTEGRATION ORDER');
  return new Promise((resolve, reject) => {
    console.log('Event', event);
    const { integration } = event;
    const { key, token, accountName, environment } = integration;

    const apiKey = decrypt(key);
    const apiToken = decrypt(token);

    if (!key || !token || !accountName || !environment) {
      return reject(new ArgumentNullError('Integration'));
    }

    vtexRequest({
      accountName,
      environment,
      apiKey,
      apiToken,
      requestType: 'Orders',
    })
      .then((response) => {
        // if (response) {
        console.log('RESPONSE', response);
        resolve(response);
        // }
      })
      .catch((err) => {
        console.error('ERROR on invoke', err);
        reject(err);
      });
  });
};
