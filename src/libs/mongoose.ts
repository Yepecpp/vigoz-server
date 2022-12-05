import mongoose, { ConnectOptions, Mongoose } from "mongoose";
const MONGO_URI = `mongodb+srv://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority`;
const CERT =`${process.env.MONGO_CERT}`
async function Checkcon(): Promise<Mongoose> {
 return mongoose.connect(
  MONGO_URI,
  { useNewUrlParser: true,
    serverSelectionTimeoutMS: 1000,
    sslCert: CERT,
    sslKey: CERT,
    ssl: true
  } as ConnectOptions);
}
export default Checkcon;
