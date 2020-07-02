require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const errors = require('common-errors');

const DocumentDBConnector = require('./middlewares/docdb-connector');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(errors.middleware.crashProtector());

if (process.env.IS_OFFLINE || process.env.NODE_ENV === 'test') {
  const MongoServerConnector = require('./middlewares/mongo-server-connector');
  app.use(MongoServerConnector);
} else {
  app.use(DocumentDBConnector);
}

module.exports = app;
