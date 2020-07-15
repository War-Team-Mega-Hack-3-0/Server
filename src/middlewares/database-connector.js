module.exports = (conn) => {
  if (process.env.IS_OFFLINE || process.env.NODE_ENV === 'test') {
    console.log('Connecting to Mongo Server');
    const MongoServerConnector = require('./mongo-server-connector');
    return MongoServerConnector(conn);
  } else {
    console.log('Connecting to MongoDB');
    const DocumentDBConnector = require('./docdb-connector');
    return DocumentDBConnector(conn);
  }
};
