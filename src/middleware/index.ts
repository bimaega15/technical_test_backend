import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config as dotenv } from "dotenv";
dotenv();

const secretKey: string | any = process.env.JWT_SECRET_KEY;

declare module "express" {
  export interface Request {
    user?: any;
  }
}
// Middleware JWT untuk verifikasi token
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Unauthorization" });
  }

  const token = authorizationHeader.split(" ")[1];
  jwt.verify(token, secretKey, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Token tidak valid" });
    }

    req.user = decoded;
    next();
  });
}

export const gate =
  (roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (req.user && roles.includes(req.user.typeMapping)) {
      next();
    } else {
      res
        .status(403)
        .json({
          message: `The module can be accessed using a user ${req.user.typeMapping}`,
        });
    }
  };
