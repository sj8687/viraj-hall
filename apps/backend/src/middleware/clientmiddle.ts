import { type Request, type Response, type NextFunction } from "express";
import { decode } from "@auth/core/jwt";
import { prisma } from "@repo/db"; 

declare module "express" {
  interface Request {
    email?: string;
    userid?: number;
  }
}

export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
const token = req.headers.authorization?.split(" ")[1];    


    console.log("Checking cookies:", token);
    
    if (!token) {
       res.status(401).json({ message: "No cookies found" });
       return
    }

   

    const decoded = await decode({
      token,
      secret: process.env.AUTH_SECRET!,
      salt: process.env.AUTH_SECRETT!, 
    });

    if (!decoded || !decoded.email) {
       res.status(403).json({ message: "Unauthorized: Invalid session" });
       return
    }

    const users = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!users) {
       res.status(403).json({ message: "User not found in database" });
       return
    }
    console.log(decoded.email);
    console.log(users.id);
    
    
    req.email = decoded.email;
    req.userid = users.id;

    
    next();
  } catch (err) {
    console.error("Session decode error:", err);
    res.status(401).json({ message: "Invalid session token" });
  }
};
