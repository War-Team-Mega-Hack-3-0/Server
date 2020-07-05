const mongoose = require('mongoose');
const fs = require('fs');

const options = {
  bufferCommands: false, // Disable mongoose buffering
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferMaxEntries: 0,
};

module.exports.getConnection = (conn, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return new Promise((resolve, reject) => {
    if (
      conn &&
      conn.db &&
      conn.db.serverConfig &&
      conn.db.serverConfig.isConnected()
    ) {
      return resolve(conn);
    }

    mongoose.set('debug', process.env.MONGOOSE_DEBUG === 'true');
    mongoose.set('bufferCommands', false);

    mongoose.connection.on('connected', () => {
      console.log('[DB] => Connected to DB');
    });

    mongoose.connection.on('error', (connectionError) => {
      console.error(`[DB] => Error while connecting \n => ${connectionError}`);
      return reject(connectionError);
    });

    let uri;
    if (process.env.IS_OFFLINE || process.env.NODE_ENV === 'test') {
      uri = `mongodb://localhost:27017/${
        process.env.NODE_ENV === 'test' ? 'megahack-test' : 'megahack-local'
      }`;
    } else {
      const ca = fs.readFileSync('certificates/rds-bundle-ca.pem');
      options.sslCA = ca;
      uri = process.env.DB_URL;
    }

    mongoose.connect(uri, options).then(() => resolve(mongoose.connection));
  });
};
