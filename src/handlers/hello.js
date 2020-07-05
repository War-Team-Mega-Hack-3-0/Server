'use strict';
const app = require('../app');
const handler = require('../handler');
const authenticate = require('../middlewares/authenticate');
const DatabaseConnector = require('../middlewares/database-connector');

const middleware = (req, res) => {
  console.log('Entered Middleware');
  console.log('auth? ', req.auth);
  return res.status(200).json({
    message: 'Go Serverless v1.0! Your function executed successfully!',
  });
};

app.get('/', middleware);
app.get('/authorized', DatabaseConnector(), authenticate, middleware);

module.exports.handler = handler(app);
