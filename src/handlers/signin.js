'use strict';
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = require('../app');
const handler = require('../handler');

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  const privateKey = fs.readFileSync('./certificates/jwt-private.key', 'utf8');
  if (email === 'test@email.com' && password === '123') {
    const token = jwt.sign({ email }, privateKey, {
      expiresIn: '10d',
      algorithm: 'RS512',
    });

    return res.status(200).json({ auth: true, token });
  }

  res.status(401).json({ auth: false });
});

module.exports.handler = handler(app);
