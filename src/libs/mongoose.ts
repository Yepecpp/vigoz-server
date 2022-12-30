import mongoose, { ConnectOptions, Mongoose } from 'mongoose';
function CreateOptions(): any {
  if (process.env.MONGO_AUTH_SOURCE === 'pem') {
    const MONGO_URI = `mongodb+srv://${process.env.MONGO_HOST}/${process.env.MONGO_DB}?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority`;
    const options: ConnectOptions = {
      serverSelectionTimeoutMS: 1000,
      sslCert: process.env.MONGO_CERT,
      sslKey: process.env.MONGO_CERT,
      ssl: true,
    };
    return { MONGO_URI, options };
  }
  const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?authSource=${process.env.MONGO_AUTH_SOURCE}&retryWrites=true&w=majority`;
  const options: any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  return { MONGO_URI, options };
}
const { MONGO_URI, options } = CreateOptions();
async function Checkcon(): Promise<Mongoose> {
  return mongoose.connect(MONGO_URI, options as ConnectOptions);
}

export default Checkcon;
