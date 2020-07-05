const mongoose = require('mongoose');
const fs = require('fs');

module.exports = (conn) => (req, res, next) => {
  console.log('Commencing database connection');
  if (
    conn &&
    conn.db &&
    conn.db.serverConfig &&
    conn.db.serverConfig.isConnected()
  ) {
    console.log('[DB] Connection already exists');
    return next();
  }

  const ca = fs.readFileSync('certificates/rds-bundle-ca.pem');

  mongoose
    .connect(process.env.DB_URL, {
      // Buffering means mongoose will queue up operations if it gets
      // disconnected from MongoDB and send them when it reconnects.
      // With serverless, better to fail fast if not connected.
      sslCA: ca,
      bufferCommands: false, // Disable mongoose buffering
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferMaxEntries: 0, // and MongoDB driver buffering
    })
    .then(() => {
      console.log('Database Connected!');
      next();
    })
    .catch((error) => {
      console.error(`[DB] Exception on connecting to Database: \n ${error}`);
      next(error);
    });
};
