const axios = require('axios');
const { ArgumentError } = require('common-errors');

const requestTypeMap = {
  Orders: { url: '/api/oms/pvt/orders', method: 'GET' },
};

module.exports.vtexRequest = async ({
  accountName,
  environment,
  apiKey,
  apiToken,
  requestType,
  data,
  params,
}) => {
  const request = requestTypeMap[requestType];
  if (!request) return Promise.reject(new ArgumentError('requestType'));

  const { url, method } = request;

  let baseURL = `https:${accountName}.${environment}.com.br`;

  const axiosConfig = {
    baseURL,
    method,
    url,
    data,
    params,
    headers: {
      'x-vtex-api-appkey': apiKey,
      'x-vtex-api-apptoken': apiToken,
    },
  };

  try {
    const response = await axios(axiosConfig);
    return response;
  } catch (error) {
    console.error('Error while requesting resources from VTEX Api', error);
    return Promise.reject(
      new Error('Error while requesting resources from VTEX Api')
    );
  }
};
