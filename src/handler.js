const serverless = require('serverless-http');

module.exports = (app) => {
  if (process.env.NODE_ENV === 'test') {
    return app;
  }

  return serverless(app);
};
