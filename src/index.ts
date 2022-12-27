import app from "./app";
import Checkcon from "@libs/mongoose";
import Logger from "@libs/logger";
import SetUp from "@utils/SetUp";
const port = process.env.PORT || 3000;
Checkcon()
  .then(() => {
    Logger.success('Connected to MongoDB');
    app.listen(port, async () => {
      await SetUp();
      Logger.info(`Server is listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    Logger.error(err);
    process.exit(1);
  });
//start server
