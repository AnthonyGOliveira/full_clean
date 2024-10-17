import app from "./config/app";
import { config } from "./config/config";

app.listen(config.server.port, () => {
  console.log(`Server is running on port: ${config.server.port}`);
});
