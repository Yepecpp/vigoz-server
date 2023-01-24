import app from './app';
import Checkcon from '@libs/mongoose';
import Logger from '@libs/logger';
import SetUp from '@utils/SetUp';
const port = process.env.port || 3000;
app.listen(port, async () => {
  Logger.success(`Server is listening on http://localhost:${port}`);
  const db = await Checkcon();
  if (db) {
    Logger.success('Connected to MongoDB');
  } else {
    Logger.warn('Not Connected to MongoDB');
    process.exit(1);
  }
  await SetUp();
});

//start server
