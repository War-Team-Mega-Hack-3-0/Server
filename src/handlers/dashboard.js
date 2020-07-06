// const AWS = require('aws-sdk');
const app = require('../app');
const handler = require('../handler');
const DatabaseConnector = require('../middlewares/database-connector');
const authenticate = require('../middlewares/authenticate');

let conn;
// const lambda = new AWS.Lambda({
//   region: 'us-east-1',
// });

app.use(DatabaseConnector(conn));

/**
 * Gets the initial dashboard information needed
 */
app.get('/profile/dashboard', authenticate, (req, res, next) => {
  const { integrations } = req.auth;

  if (!integrations || integrations.length === 0) {
    return res.status(403).send('No integrations');
  }

  const integration = integrations[0];

  console.log('Integration', integration);

  const params = {
    FunctionName: process.env.VTEX_ORDER,
    InvocationType: 'Event',
    Payload: JSON.stringify({ integration }),
  };

  console.log('params for invoking', params);

  // MOCK of the Lambda return
  return res.status(200).json({
    data: {
      graphs: {
        doughnutData: {
          data: [300, 50, 100], // Physic, Ecommerce, Marketplace
        },
        dataHours: {
          labels: ['8hr', '10hr', '14hr', '16hr', '19hr'],
          data: [70, 51, 80, 65, 87],
        },
        dataMonths: {
          labels: ['Jan', 'Mar', 'Jun', 'Out', 'Dez'],
          data: [700, 510, 800, 650, 870],
        },
      },
    },
  });

  // lambda.invoke(params, (err, data) => {
  //   if (err) {
  //     console.error('Error on lambda invoke', err);
  //     return res
  //       .status(502)
  //       .json({ error: true, message: 'Cant reach service' });
  //   }

  //   console.log('Success', data);
  //   return res.status(200).json({ data });
  // });
});

module.exports.handler = handler(app);
