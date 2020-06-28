'use strict';
const app = require('../app');
const handler = require('../handler');

app.get('/', (req, res, next) => {
  return res.status(200).json({
    message: 'Go Serverless v1.0! Your function executed successfully!',
  });
});

module.exports.handler = handler(app);
