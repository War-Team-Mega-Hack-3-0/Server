const { vtexRequest } = require('../../utils/vtex-request');
const { ArgumentNullError } = require('common-errors');

// event: {integration: { key, token }}
module.exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    console.log('Event', event);
    const { integration } = event;
    const { key, token, accountName, environment } = integration;

    if (!key || !token || !accountName || !environment) {
      return reject(new ArgumentNullError('Integration'));
    }

    vtexRequest({
      accountName,
      environment,
      apiKey: key,
      apiToken: token,
      requestType: event.requestType,
    })
      .then((response) => {
        // if (response) {
        console.log('RESPONSE', response);
        resolve(response);
        // }
      })
      .catch((err) => reject(err));
  });
};
