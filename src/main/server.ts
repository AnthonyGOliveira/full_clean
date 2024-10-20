import app from "./config/app";
import { config } from "./config/config";
import { MongoDatabaseHelper } from "../infra/db/mongodb/helpers/mongodb-helper";

const databaseUrl = `${config.database.url}/${config.database.name}?authSource=admin`;

MongoDatabaseHelper.connect(databaseUrl)
  .then(() => {
    app.listen(config.server.port, () => {
      console.log(`Server is running on port: ${config.server.port}`);
    });
  })
  .catch(console.error);
