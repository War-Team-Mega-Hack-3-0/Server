'use strict';
const app = require('../app');
const handler = require('../handler');
const { sign } = require('../utils/jwt');

const DatabaseConnector = require('../middlewares/database-connector');

app.use(DatabaseConnector());

app.post('/signin', (req, res) => {
  const { email } = req.body;

  try {
    const token = sign({ email });
    return res.status(200).json({ auth: true, token });
  } catch (error) {
    res.status(401).json({ auth: false });
  }
});

module.exports.handler = handler(app);
