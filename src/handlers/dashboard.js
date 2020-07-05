const AWS = require('aws-sdk');
const { ArgumentNullError } = require('common-errors');

const app = require('../app');
const handler = require('../handler');
const DatabaseConnector = require('../middlewares/database-connector');
const authenticate = require('../middlewares/authenticate');

let conn;
const lambda = new AWS.Lambda({
  region: 'us-east-1',
});

app.use(DatabaseConnector(conn));

/**
 * Gets the initial dashboard information needed
 */
app.get('/profile/dashboard', authenticate, (req, res, next) => {
  const { integrations } = req.auth;

  if (!integrations || integrations.length === 0) {
    return next(new ArgumentNullError('integrations'));
  }

  const [integration] = integrations;

  const params = {
    FunctionName: process.env.VTEX_ORDER,
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({ integration }),
  };

  return lambda.invoke(params, (err, data) => {
    if (err) {
      console.error('Error on lambda invoke', err);
      return res
        .status(502)
        .json({ error: true, message: 'Cant reach service' });
    }

    return res.status(200).json({ data });
  });
});

module.exports.handler = handler(app);
