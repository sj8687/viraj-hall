import { type Request, type Response, type NextFunction } from "express";
import { getDerivedEncryptionKey } from "../helper/secret";
import jose from "jose"


export const middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
     console.log(req.cookies);

 const token = req.cookies[process.env.NODE_ENV === 'production' ? `${process.env.PROD_SALT}` : `${process.env.DEV_SALT}`];

    // const token = req.cookies[process.env.PROD_SALT as string];

 console.log(token);
 
 
    const encryptionKey = await getDerivedEncryptionKey();
    const { plaintext } = await jose.compactDecrypt(token, encryptionKey);
    const decodedPayload = JSON.parse(new TextDecoder().decode(plaintext));
    
    if (!token) {
      res.send("unauthorized user");
      return;
    }

    if (decodedPayload.role === "admin") {
      next();
    }else{
      res.status(401).json({success:false,message:"you not authorized"});
    }
  } catch (err) {
    console.error("Session decode error:", err);
    res.status(401).json({ message: "Invalid session token" });
  }
};
