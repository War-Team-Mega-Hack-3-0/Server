const errors = require('common-errors');

const { errorHandler } = errors.middleware;

module.exports = (app, error_handler = errorHandler) => {
  app.use(error_handler);

  // if (process.env.NODE_ENV === 'test') {
  //   return app;
  // }

  // return serverless(app);
  return app;
};
