const { vtexRequest } = require('../../utils/vtex-request');

// event: {integration: { key, token }}
module.exports.handler = async (event, context) => {
  const { key, token } = event.integration;
};
