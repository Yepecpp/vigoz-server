import app from "./app";
import Checkcon from "@libs/mongoose";
const port = process.env.PORT || 3000;
Checkcon()
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
//start server
