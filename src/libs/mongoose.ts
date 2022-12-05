import mongoose, { ConnectOptions, Mongoose } from "mongoose";
const MONGO_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;

async function Checkcon(): Promise<Mongoose> {
 return mongoose.connect(
  MONGO_URI,
  { useNewUrlParser: true,
    serverSelectionTimeoutMS: 1000
  } as ConnectOptions);
}
export default Checkcon;
