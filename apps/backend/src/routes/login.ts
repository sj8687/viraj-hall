import express, { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "@repo/db";
import { loginSchema } from "@repo/zod";
import { registerSchema } from "@repo/zod";

export const login = Router();

// POST /login/validate
login.post("/validate", async (req, res) => {
  try {
    const { email, password } = req.body;

    const valid = loginSchema.safeParse({ email, password });
    if (!valid.success) {
      res.status(400).json({ message: "user is not vaild"});
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    res.json({
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: false,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});






// POST /login/google
login.post("/google", async (req, res) => {
  try {
    const { email, name, image, googleId } = req.body;

    if (!email) {
      res.status(400).json({ message: "Missing email" });
      return;
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: { email, name, image, googleId: googleId?.toString() },
      });
    }

    res.json({
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: false,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// backend/routes/login.ts (or signup.ts)



login.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // ✅ Validate input
  const valid = registerSchema.safeParse({ name, email, password });
  if (!valid.success) {
     res.status(400).json({ success: false, message: "Invalid input" });
     return
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
       res.status(409).json({ success: false, message: "User already exists" });
       return
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

     res.status(201).json({ success: true, message: "Signup successful" });
  } catch (err) {
    console.error(err);
     res.status(500).json({ success: false, message: "Server error" });
  }
});

