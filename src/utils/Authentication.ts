import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config as dotenv } from "dotenv";
dotenv();

class Authentication {
  public static passwordHash = (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
  };

  public static passwordCompare = async (
    text: string,
    encryptText: string
  ): Promise<boolean> => {
    let result = await bcrypt.compare(text, encryptText);
    return result;
  };

  public static generateToken = (
    data: object
  ): string => {
    const secretKey: string = process.env.JWT_SECRET_KEY || "secret";
    const token: string = jwt.sign(data, secretKey);
    return token;
  };
}

export default Authentication;
