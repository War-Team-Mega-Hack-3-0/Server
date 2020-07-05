const app = require('../app');
const handler = require('../handler');

const DatabaseConnector = require('../middlewares/database-connector');
const authenticate = require('../middlewares/authenticate');

let conn;
app.use(DatabaseConnector(conn));

/**
 * Gets the initial dashboard information needed
 */
app.get('/profile/dashboard', authenticate, (req, res, next) => {
  const profile = req.auth;
  res.status(200).json({ data: 'DEU BOM' });
});

module.exports.handler = handler(app);
