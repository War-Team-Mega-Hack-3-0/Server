const { MongoMemoryServer } = require('mongodb-memory-server');

async function getMongoMemoryServer() {
  const mongod = new MongoMemoryServer({
    instance: {
      dbName: 'test',
    },
  });

  const uri = await mongod.getUri();
  const port = await mongod.getPort();
  const dbPath = await mongod.getDbPath();
  const dbName = await mongod.getDbName();

  process.env.DB_URL = uri;
  return {
    uri,
    port,
    dbPath,
    dbName,
  };
}

module.exports = {
  getMongoMemoryServer,
};
