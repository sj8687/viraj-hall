import { type Request, type Response, type NextFunction } from "express";
import { prisma } from "@repo/db"; 
import jose from "jose"
import { getDerivedEncryptionKey } from "../helper/secret";


declare module "express" {
  interface Request {
    email?: string;
    userid?: number;
  }
}

export const userMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
     console.log(req.cookies);

    const token = req.cookies[process.env.NODE_ENV === "production" ? `${process.env.PROD_SALT}` : `${process.env.DEV_SALT}`];
    // const token = req.cookies[process.env.PROD_SALT as string];


     console.log(token);

    if (!token) {
      res.status(401).json({ message: "unauthorized user" });
      return; 
    }

    const encryptionKey = await getDerivedEncryptionKey();
    const { plaintext } = await jose.compactDecrypt(token, encryptionKey);
    const decodedPayload = JSON.parse(new TextDecoder().decode(plaintext));

    if (decodedPayload.role === "user") {
      const users = await prisma.user.findUnique({
        where: { email: decodedPayload.email },
      });

      if (!users) {
        res.status(403).json({ message: "User not found in database" });
        return; 
      }

      req.email = decodedPayload.email;
      req.userid = users.id;
      next(); 
    } else {
      res.status(401).json({ success: false, message: "you not authorized" });
      return;
    }
  } catch (err) {
    console.error("Session decode error:", err);
    res.status(401).json({ message: "Invalid session token" });
    return;
  }
};
