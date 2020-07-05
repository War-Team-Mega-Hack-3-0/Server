const AWS = require('aws-sdk');

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
  console.log(req.auth);
  const { integrations } = req.auth;

  if (!integrations || integrations.length === 0) {
    return res.status(403).send('No integrations');
  }

  const integration = integrations[0];

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
