import { type Request, type Response, type NextFunction } from "express";
import { decode } from "@auth/core/jwt"; 

export const middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      res.status(401).json({ message: "No cookies found" });
      return;
    }

    
    console.log(token);
    

    if (!token) {
      res.status(401).json({ message: "No auth token found" });
      return;
    }

    const decoded = await decode({
      token:token,
      salt: process.env.AUTH_SECRETT!,
      secret: process.env.AUTH_SECRET!
    });

    console.log(decoded);
    

    if (!decoded || decoded.email !== "shreyashjadhav59807@gmail.com") {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    (req as any).session = decoded;

    next(); 
  } catch (err) {
    console.error("Session decode error:", err);
    res.status(401).json({ message: "Invalid session token" });
  }
};
