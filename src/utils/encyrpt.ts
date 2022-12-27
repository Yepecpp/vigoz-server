import bcrypt from "bcryptjs";
const saltRounds = //convert it to int
  process.env.SALT && Number.isInteger(parseInt(process.env.SALT, 10))
    ? parseInt(process.env.SALT, 10)
    : 10;
    
export default class Encrypt {
  static hash(password: string): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }
  static compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
