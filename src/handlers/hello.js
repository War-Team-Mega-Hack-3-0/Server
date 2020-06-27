'use strict';
const { app, serverless } = require('../header');

app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Go Serverless v1.0! Your function executed successfully!',
  });
});

module.exports.handler = serverless(app);
