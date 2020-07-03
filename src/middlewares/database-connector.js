module.exports = () => {
  if (process.env.IS_OFFLINE || process.env.NODE_ENV === 'test') {
    const MongoServerConnector = require('./mongo-server-connector');
    return MongoServerConnector;
  } else {
    const DocumentDBConnector = require('./docdb-connector');
    return DocumentDBConnector;
  }
};
