require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const DocumentDBConnector = require('./middlewares/docdb-connector');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

app.use(DocumentDBConnector);

module.exports = app;
