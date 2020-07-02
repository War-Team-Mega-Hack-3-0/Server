const { getMongoMemoryServer } = require('../utils/mongo-server');
const mongoose = require('mongoose');

module.exports = async (req, res, next) => {
  const { uri } = await getMongoMemoryServer();
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
