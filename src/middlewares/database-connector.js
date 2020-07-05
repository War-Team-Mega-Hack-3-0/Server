module.exports = () => {
  if (process.env.IS_OFFLINE || process.env.NODE_ENV === 'test') {
    console.log('Connecting to Mongo Server');
    const MongoServerConnector = require('./mongo-server-connector');
    return MongoServerConnector;
  } else {
    console.log('Connecting to DocumentDB');
    const DocumentDBConnector = require('./docdb-connector');
    return DocumentDBConnector;
  }
};
