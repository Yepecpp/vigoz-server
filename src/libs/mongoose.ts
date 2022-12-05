import mongoose, { ConnectOptions } from "mongoose";
const MONGO_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;

mongoose.connect(
  MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions,
  (err) => {
    if (err) {
       console.log(MONGO_URI); 
      console.log(err.message);
      process.exit(1);
    } 
      console.log("Successfully Connected!");
    
  }
);
