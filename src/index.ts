import app from "./app";
import Checkcon from "@libs/mongoose";
import Logger from "@libs/logger";
const port = process.env.PORT || 3000;
Checkcon()
  .then(() => {
    Logger.success('Connected to MongoDB');
    app.listen(port, () => {
      Logger.info(`Server is listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    Logger.error(err);
    process.exit(1);
  });
//start server
