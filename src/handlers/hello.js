'use strict';
const app = require('../app');
const handler = require('../handler');

const middleware = (req, res) => {
  console.log('Entered Middleware');
  return res.status(200).json({
    message: 'Go Serverless v1.0! Your function executed successfully!',
  });
};

app.get('/', middleware);
app.get('/authorized', middleware);

module.exports.handler = handler(app);
