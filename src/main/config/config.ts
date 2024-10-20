export const config = {
  server: {
    port: process.env.SERVER_PORT || 3000,
  },
  database: {
    url: process.env.MONGO_URL || "mongodb://root:root@localhost:27017",
    name: process.env.MONGO_DATABASE_NAME || "clean-node-api",
  },
  logger: {
    filenamePath: process.env.LOGGER_FILENAME_PATH || "logs/app.log",
    level: process.env.LOGGER_LEVEL || "info",
  },
};
