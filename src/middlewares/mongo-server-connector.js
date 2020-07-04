const { getMongoMemoryServer } = require('../utils/mongo-server');
const mongoose = require('mongoose');

module.exports = async (req, res, next) => {
  let uri;
  if (process.env.DATABASE_IN_MEMORY > 0) {
    const memoryServer = await getMongoMemoryServer();
    // eslint-disable-next-line prefer-destructuring
    uri = memoryServer.uri;
  } else {
    uri = `mongodb://localhost:27017/${
      process.env.NODE_ENV === 'test' ? 'megahack-test' : 'megahack-local'
    }`;
  }

  console.log('URI', uri);
  mongoose
    .connect(uri, {
      // Buffering means mongoose will queue up operations if it gets
      // disconnected from MongoDB and send them when it reconnects.
      // With serverless, better to fail fast if not connected.
      bufferCommands: false, // Disable mongoose buffering
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferMaxEntries: 0, // and MongoDB driver buffering
    })
    .then(() => {
      next();
    })
    .catch((error) => {
      console.error(`[DB] Exception on connecting to Database: \n ${error}`);
      next(error);
    });
};
