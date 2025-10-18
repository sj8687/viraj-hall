import { prisma } from "@repo/db";
import { registerSchema, verifyuser } from "@repo/zod";
import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";

export const addUser = Router();

addUser.post("/user", async (req: Request, res: Response) => {
  try {
    const { name, email, image, id } = req.body;
    const userExist = await prisma.user.findUnique({ where: { email } });
    if (!userExist?.password) {
      const result = await prisma.user.upsert({
        where: { email },
        update: {
          name,
          image,
          googleId: id?.toString(),
        },
        create: {
          name,
          email,
          image,
          googleId: id?.toString(),
          role: process.env.ADMIN_EMAIL === email ? 'admin' : 'user'
        },
      });
      if (result) {
        res.status(200).json({ id: result.id });
      } else {
        res.status(500).send("error from backend res..... EEEEEE");
      }
    } else {
      res.status(500).send("worng user from backend res..... EEEEEE");
    }
  } catch (error) {
    console.log(error);
  }
});

addUser.post("/signupuser", async (req: Request, res: Response) => {
  const email = req.body.email as string | undefined;
  const name = req.body.name as string | undefined;
  const password = req.body.password as string | undefined;

  try {
    if (!email || !name || !password) {
      res
        .status(400)
        .json({ success: false, message: "please provide all values" });
      return;
    }
    const vaidInput = registerSchema.safeParse({ name, email, password });
    if (!vaidInput.success) {
      res
        .status(400)
        .json({ success: false, message: vaidInput.error.message });
      return;
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      res.status(400).json({ success: false, message: "user already exists" });
      return;
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      if (hashPassword) {
        await prisma.user.create({
          data: {
            email,
            name,
            password: hashPassword,
            role: process.env.ADMIN_EMAIL === email ? 'admin' : 'user'
          },
        });
        res.status(201).json({ success: true, message: "signup successfully" });
      } else {
        res.status(500).json({ success: false, message: "signup failed" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error OR see your internet",
    });
  }
});





addUser.post("/verify", async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const Data = req.body.customeData;
    const parseData = verifyuser.safeParse({ email });
    if (!parseData.success) {
      res.send("email format not correct");
      return;
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(404).send("user not found");
      return;
    }
    if (Data == "select only email") {
      res.status(200).send(user.email);
    } else if (Data == "select only id and role") {
      res
        .status(200)
        .json({ email: user?.email, id: user?.id, role: user?.role });
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    console.log(error);
  }
});

